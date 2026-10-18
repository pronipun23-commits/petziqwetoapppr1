import { useState, useRef } from 'react';
import {
  X, CheckCircle2, Shield, PawPrint, Phone, Mail, MapPin, User,
  FileText, Sparkles, Loader2, AlertCircle, QrCode, Tag, Camera, Image as ImageIcon
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { generateTagId, getTagPublicUrl } from '@/lib/tagUtils';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import type { TagShape, TagColor } from '@/components/TagProductPreview';

export type TargetStage = 'puppy' | 'adult' | 'bundle';
export type TagSize = '35 mm' | '50 mm' | '60 mm';

export interface BuySmartTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  petName: string;
  shape: TagShape;
  color: TagColor;
  initialStage?: TargetStage;
  initialDogSize?: 'medium' | 'large';
  price?: number;
  shippingFee?: number;
  tagPrice?: number;
  userId?: string | null;
  userEmail?: string | null;
  initialPhotoPreview?: string | null;
  onOrderSuccess: (order: {
    orderNumber: string;
    tagId: string;
    publicUrl: string;
    petName: string;
  }) => void;
}

export function BuySmartTagModal({
  isOpen,
  onClose,
  petName: initialPetName,
  shape,
  color,
  initialStage = 'adult',
  initialDogSize = 'medium',
  shippingFee = 49,
  userId,
  userEmail,
  initialPhotoPreview = null,
  onOrderSuccess,
}: BuySmartTagModalProps) {
  const [step, setStep] = useState<'info' | 'shipping' | 'success'>('info');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stage & Size selection state
  const [targetStage, setTargetStage] = useState<TargetStage>(initialStage);
  const [dogSizeVariant, setDogSizeVariant] = useState<'medium' | 'large'>(initialDogSize);

  // Pet information state
  const [petName, setPetName] = useState(initialPetName || '');
  const [species, setSpecies] = useState('Dog');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState('Male');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [contactEmail, setContactEmail] = useState(userEmail || '');
  const [microchipNumber, setMicrochipNumber] = useState('');
  const [allergiesNotes, setAllergiesNotes] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialPhotoPreview);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Computed pricing and tag size
  const tagPrice = targetStage === 'bundle' ? 648 : 324;
  const totalPrice = tagPrice + shippingFee;

  const tagSize: TagSize =
    targetStage === 'puppy'
      ? '35 mm'
      : targetStage === 'adult'
      ? (dogSizeVariant === 'large' ? '60 mm' : '50 mm')
      : '35 mm + 50 mm (Bundle)';

  // Shipping information state
  const [shippingName, setShippingName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Placed order outcome
  const [createdOrder, setCreatedOrder] = useState<{
    orderNumber: string;
    tagId: string;
    publicUrl: string;
    petName: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleNextToShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petName.trim()) {
      setError('Please provide your pet\'s name.');
      return;
    }
    if (!emergencyPhone.trim()) {
      setError('Please provide an emergency contact phone number for the tag.');
      return;
    }
    setError(null);
    if (!shippingName) setShippingName(ownerName || '');
    if (!phone) setPhone(emergencyPhone || '');
    setStep('shipping');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingName.trim() || !phone.trim() || !address.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
      setError('Please complete all shipping address fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // 1. Generate unique Smart Tag ID
      const newTagId = generateTagId();
      const publicUrl = getTagPublicUrl(newTagId);

      // Order number: PZO-XXXXXX
      const randNum = Math.floor(100000 + Math.random() * 900000);
      const orderNumber = `PZO-${randNum}`;

      const stageLabel =
        targetStage === 'puppy'
          ? 'Puppy (35 mm)'
          : targetStage === 'adult'
          ? `Adult Dog (${tagSize})`
          : 'Puppy + Adult Bundle (35 mm + 50 mm)';

      // 2. Insert smart_tag_orders
      const orderPayload = {
        order_number: orderNumber,
        customer_name: ownerName.trim() || shippingName.trim() || 'Valued Customer',
        phone: phone.trim(),
        email: (contactEmail || userEmail || 'guest@petziq.com').trim(),
        shipping_name: shippingName.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        postal_code: postalCode.trim(),
        country: 'India',
        quantity: targetStage === 'bundle' ? 2 : 1,
        amount: totalPrice,
        payment_status: 'pending', // Pending: Admin will contact client by phone for payment
        shipping_status: 'processing',
        user_id: userId || null,
        notes: `Smart Tag Stage: ${stageLabel}, Size: ${tagSize}, Shape: ${shape}, Color: ${color}, Pet: ${petName.trim()} (${species})`,
      };

      const { data: orderData, error: orderErr } = await supabase
        .from('smart_tag_orders')
        .insert(orderPayload)
        .select('id, order_number')
        .maybeSingle();

      if (orderErr) {
        console.warn('Orders table direct insert failed or restricted:', orderErr.message);
      }

      const orderId = orderData?.id || null;

      // 3. Insert into smart_tags table with live active profile so the QR code works immediately
      const tagDetails = {
        species,
        breed: breed.trim(),
        gender,
        target_stage: targetStage,
        tag_size: tagSize,
        identification_notes: [
          microchipNumber.trim() ? `Microchip: ${microchipNumber.trim()}` : '',
          allergiesNotes.trim() ? `Medical / Allergies: ${allergiesNotes.trim()}` : '',
        ].filter(Boolean).join(' • '),
        shape,
        color,
      };

      const ownerInfo = {
        owner_name: ownerName.trim() || shippingName.trim(),
        emergency_contact: emergencyPhone.trim(),
        contact_phone: emergencyPhone.trim(),
        contact_email: contactEmail.trim(),
      };

      const visibility = {
        show_owner_name: true,
        show_emergency_contact: true,
        show_contact_phone: true,
        show_contact_email: Boolean(contactEmail.trim()),
        show_identification_notes: true,
        show_food_info: true,
        show_exercise_info: true,
        show_grooming_info: true,
        show_training_info: true,
        show_behavior_info: true,
        show_general_care: true,
      };

      const tagPayload: Record<string, unknown> = {
        tag_id: newTagId,
        name: petName.trim(),
        tag_type: 'pet',
        status: 'active', // Activated so anyone scanning the tag immediately sees the pet's profile
        qr_url: publicUrl,
        photo_url: photoPreview || null,
        user_id: userId || null,
        owner_id: userId || null,
        order_id: orderId,
        tag_details: tagDetails,
        visibility: visibility,
        owner_info: ownerInfo,
      };

      const { error: tagErr } = await supabase
        .from('smart_tags')
        .insert(tagPayload);

      if (tagErr) {
        console.warn('Smart tags table direct insert note:', tagErr.message);
      }

      // 4. Create activity event for admin dashboard
      try {
        await supabase.from('activity_events').insert({
          event_type: 'smart_tag_order_created',
          summary: `New Smart Tag order ${orderNumber} for "${petName.trim()}" (Tag: ${newTagId})`,
          actor_id: userId || null,
          actor_name: ownerName.trim() || shippingName.trim() || 'Customer',
          metadata: {
            order_number: orderNumber,
            tag_id: newTagId,
            pet_name: petName.trim(),
            amount: price,
            shape,
            color,
          },
        });
      } catch {
        // Non-blocking activity event
      }

      // Also persist in local storage fallback so it seamlessly appears everywhere in UI
      try {
        const localKey = 'petziqq_smart_tags';
        const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
        existing.unshift({
          id: newTagId,
          tag_id: newTagId,
          name: petName.trim(),
          tag_type: 'pet',
          status: 'active',
          photo_url: photoPreview || null,
          user_id: userId || '',
          tag_details: tagDetails,
          visibility: visibility,
          owner_info: ownerInfo,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        localStorage.setItem(localKey, JSON.stringify(existing));

        // Save order to petziq_smart_tag_orders
        const ordersKey = 'petziq_smart_tag_orders';
        const existingOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
        existingOrders.unshift({
          id: orderId || `order-${Date.now()}`,
          order_number: orderNumber,
          customer_name: orderPayload.customer_name,
          phone: orderPayload.phone,
          email: orderPayload.email,
          shipping_name: orderPayload.shipping_name,
          address: orderPayload.address,
          city: orderPayload.city,
          state: orderPayload.state,
          postal_code: orderPayload.postal_code,
          country: orderPayload.country,
          quantity: 1,
          amount: price,
          payment_status: 'pending',
          shipping_status: 'processing',
          user_id: userId || '',
          notes: orderPayload.notes,
          created_at: new Date().toISOString(),
          tag_id: newTagId,
          pet_name: petName.trim(),
        });
        localStorage.setItem(ordersKey, JSON.stringify(existingOrders));
      } catch {
        // Ignore local storage error
      }

      const orderResult = {
        orderNumber,
        tagId: newTagId,
        publicUrl,
        petName: petName.trim(),
      };

      setCreatedOrder(orderResult);
      setStep('success');
      onOrderSuccess(orderResult);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not process order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl border border-white/10 bg-ink-900/95 p-6 sm:p-8 shadow-2xl glass">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-ink-400 hover:bg-white/10 hover:text-ink-100 transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-brand-500 to-ocean-500 text-white shadow-soft">
            <Tag className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold text-ink-50">
                {step === 'success' ? 'Smart Tag Ordered!' : 'Order Petziq Smart Tag'}
              </h2>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                ₹{totalPrice}
              </span>
            </div>
            <p className="text-xs text-ink-300 mt-0.5">
              {step === 'info' && 'Step 1 of 2: Select tag stage & size, and fill in pet details'}
              {step === 'shipping' && 'Step 2 of 2: Shipping & delivery details'}
              {step === 'success' && 'QR code generated and order placed in Admin Dashboard'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Pet Information & Stage/Size Selector */}
        {step === 'info' && (
          <form onSubmit={handleNextToShipping} className="mt-6 space-y-4">
            {/* Who is the Smart Tag for? Section */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-emerald-400" />
                  Who is the Smart Tag for?
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Size: {tagSize}
                </span>
              </div>
              <p className="text-xs text-ink-300 mb-3">
                Select your pet's life stage. We automatically calibrate the tag to the optimal size for their collar.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Option 1: Puppy */}
                <button
                  type="button"
                  onClick={() => setTargetStage('puppy')}
                  className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                    targetStage === 'puppy'
                      ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : 'border-white/10 bg-white/[0.02] text-ink-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-xs text-ink-50">Puppy</span>
                    <span className="font-mono text-xs font-bold text-emerald-400">₹324</span>
                  </div>
                  <span className="text-[11px] text-ink-400 mt-1 font-mono">Size: 35 mm</span>
                  <span className="text-[10px] text-emerald-300/80 mt-0.5">Lightweight for young pups</span>
                </button>

                {/* Option 2: Adult Dog */}
                <button
                  type="button"
                  onClick={() => setTargetStage('adult')}
                  className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                    targetStage === 'adult'
                      ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : 'border-white/10 bg-white/[0.02] text-ink-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-xs text-ink-50">Adult Dog</span>
                    <span className="font-mono text-xs font-bold text-emerald-400">₹324</span>
                  </div>
                  <span className="text-[11px] text-ink-400 mt-1 font-mono">
                    Size: {dogSizeVariant === 'large' ? '60 mm' : '50 mm'}
                  </span>
                  <span className="text-[10px] text-emerald-300/80 mt-0.5">Optimal everyday collar fit</span>
                </button>

                {/* Option 3: Puppy + Adult Bundle */}
                <button
                  type="button"
                  onClick={() => setTargetStage('bundle')}
                  className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                    targetStage === 'bundle'
                      ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : 'border-white/10 bg-white/[0.02] text-ink-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-xs text-ink-50">Puppy + Adult</span>
                    <span className="font-mono text-xs font-bold text-emerald-400">₹648</span>
                  </div>
                  <span className="text-[11px] text-ink-400 mt-1 font-mono">35 mm + 50 mm</span>
                  <span className="text-[10px] text-emerald-300/80 mt-0.5">Both stages included (2 Tags)</span>
                </button>
              </div>

              {/* Dog size fine-tuning when Adult is selected */}
              {targetStage === 'adult' && (
                <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
                  <span className="text-ink-300">Dog breed size calibration:</span>
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-black/40 p-1 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setDogSizeVariant('medium')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                        dogSizeVariant === 'medium'
                          ? 'bg-emerald-500 text-ink-950 font-bold'
                          : 'text-ink-300 hover:text-white'
                      }`}
                    >
                      Adult / Medium (50 mm)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDogSizeVariant('large')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                        dogSizeVariant === 'large'
                          ? 'bg-emerald-500 text-ink-950 font-bold'
                          : 'text-ink-300 hover:text-white'
                      }`}
                    >
                      Very Large Dog (60 mm)
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-300 flex items-center gap-2 mb-3">
                <PawPrint className="h-3.5 w-3.5 text-emerald-400" />
                Pet Identification
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink-200 mb-1">
                    Pet's Name <span className="text-brand-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="e.g. Leo, Bella, Max"
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-200 mb-1">Species</label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-200 mb-1">Breed (Optional)</label>
                  <input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    placeholder="e.g. Golden Retriever, Persian"
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-200 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              {/* Pet Photo Upload Section */}
              <div className="mt-4 border-t border-white/[0.06] pt-3.5">
                <label className="block text-xs font-medium text-ink-200 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-brand-400" />
                    Pet Photo (For QR Public Profile)
                  </span>
                  <span className="text-[10px] text-ink-400">Optional · Max 5MB</span>
                </label>

                <div className="flex items-center gap-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.03] transition hover:border-brand-400 hover:bg-brand-500/10"
                  >
                    {photoPreview ? (
                      <>
                        <img src={photoPreview} alt="Pet preview" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                          <Camera className="h-5 w-5 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-ink-400 transition group-hover:text-brand-300">
                        <Camera className="h-5 w-5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 5 * 1024 * 1024) {
                          setError('Photo must be under 5MB');
                          return;
                        }
                        setPhotoFile(file);
                        const reader = new FileReader();
                        reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
                        reader.readAsDataURL(file);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-ghost py-1.5 px-3 text-xs inline-flex items-center gap-1.5"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      {photoPreview ? 'Change Photo' : 'Upload Pet Photo'}
                    </button>
                    {photoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPreview(null);
                          setPhotoFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="ml-2 text-xs text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                    <p className="mt-1 text-[11px] text-ink-400">
                      {photoPreview ? "Photo selected and will appear on your pet's scan profile!" : "Uploaded photo is shown to anyone scanning your smart tag."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ocean-300 flex items-center gap-2 mb-3">
                <Phone className="h-3.5 w-3.5" />
                Emergency Contact (QR Profile)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink-200 mb-1">
                    Emergency Phone <span className="text-brand-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-200 mb-1">Owner Name</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Your name"
                    className="input-field text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-ink-200 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="owner@example.com"
                    className="input-field text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-300 flex items-center gap-2 mb-3">
                <FileText className="h-3.5 w-3.5" />
                Medical & ID Notes (Optional)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink-200 mb-1">Microchip No.</label>
                  <input
                    type="text"
                    value={microchipNumber}
                    onChange={(e) => setMicrochipNumber(e.target.value)}
                    placeholder="e.g. 981098123456789"
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-200 mb-1">Allergies / Special Needs</label>
                  <input
                    type="text"
                    value={allergiesNotes}
                    onChange={(e) => setAllergiesNotes(e.target.value)}
                    placeholder="e.g. Needs insulin, Friendly"
                    className="input-field text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-ink-400 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-brand-400" />
                <span>Selected style: <strong className="text-ink-100 capitalize">{shape} · {color}</strong></span>
              </div>
              <button type="submit" className="btn-primary py-2.5 px-6 text-sm">
                Next: Shipping Details &rarr;
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Shipping Information */}
        {step === 'shipping' && (
          <form onSubmit={handlePlaceOrder} className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-300 flex items-center gap-2 mb-3">
                <MapPin className="h-3.5 w-3.5" />
                Delivery Address (India)
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-ink-200 mb-1">Recipient Full Name *</label>
                    <input
                      type="text"
                      required
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      placeholder="Full name"
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-200 mb-1">Delivery Mobile *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="input-field text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-200 mb-1">Street Address & Landmark *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Flat / House No, Street, Landmark"
                    className="input-field text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-ink-200 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Bangalore"
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-200 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Karnataka"
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-200 mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="560001"
                      className="input-field text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 text-xs space-y-2">
              <div className="flex justify-between text-ink-300">
                <span>
                  {targetStage === 'bundle' ? '2x' : '1x'} Petziq Smart Tag ({shape}, {color}) —{' '}
                  <span className="text-emerald-300 font-medium">
                    {targetStage === 'puppy'
                      ? 'Puppy (35 mm)'
                      : targetStage === 'adult'
                      ? `Adult Dog (${tagSize})`
                      : 'Puppy + Adult Bundle (35 mm + 50 mm)'}
                  </span>
                </span>
                <span className="font-semibold text-ink-100">₹{tagPrice}</span>
              </div>
              <div className="flex justify-between text-ink-300">
                <span>Selected Tag Dimension</span>
                <span className="font-mono text-emerald-400 font-semibold">{tagSize}</span>
              </div>
              <div className="flex justify-between text-ink-300">
                <span>Delivery & Handling Fee</span>
                <span className="font-semibold text-ink-100">₹{shippingFee}</span>
              </div>
              <div className="flex justify-between text-ink-300">
                <span>Laser Engraving & Lifetime Hosted QR Profile</span>
                <span className="font-semibold text-emerald-400">INCLUDED</span>
              </div>
              <div className="border-t border-white/[0.08] pt-2 flex justify-between text-sm font-bold text-ink-50">
                <span>Total Amount</span>
                <span className="text-emerald-300">₹{totalPrice}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('info')}
                className="btn-ghost py-2.5 px-4 text-sm"
                disabled={submitting}
              >
                &larr; Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating QR & Creating Order...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Confirm & Place Order (₹{totalPrice})
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success & Generated QR Code Display */}
        {step === 'success' && createdOrder && (
          <div className="mt-6 text-center space-y-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-green-500/15 border border-green-500/30 text-green-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <h3 className="font-display text-2xl font-bold text-ink-50">
                Order Confirmed: {createdOrder.orderNumber}
              </h3>
              <p className="mt-1 text-sm text-ink-300 max-w-md mx-auto">
                Your Smart Tag for <strong className="text-brand-300">{createdOrder.petName}</strong> is created! The QR code below is configured with your pet's info and will be laser-engraved onto your tag.
              </p>
            </div>

            {/* Generated QR Box */}
            <div className="mx-auto max-w-sm rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center">
              <div className="inline-block rounded-2xl bg-white p-3 shadow-glow-blue">
                <QRCodeDisplay value={createdOrder.publicUrl} size={180} />
              </div>
              <div className="mt-4">
                <span className="font-mono text-xs font-semibold text-brand-300 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
                  {createdOrder.tagId}
                </span>
                <p className="mt-2 text-xs text-ink-400 break-all">
                  Public profile URL: <a href={createdOrder.publicUrl} target="_blank" rel="noreferrer" className="text-ocean-300 underline hover:text-ocean-200">{createdOrder.publicUrl}</a>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-4 text-xs text-ink-200 max-w-md mx-auto text-left space-y-2">
              <div className="flex items-center gap-2 text-brand-300 font-semibold text-sm">
                <Phone className="h-4 w-4" />
                <span>Next Step: Payment Verification</span>
              </div>
              <p>
                Our team will contact you directly at <strong className="text-ink-50">{phone || emergencyPhone}</strong> to confirm your order details and share the secure payment link / UPI instructions.
              </p>
              <p className="text-ink-400 text-[11px]">
                You can track your order status in real time right in the Petziq Smart Tags section.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3 justify-center">
              <a
                href={createdOrder.publicUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary py-2.5 px-5 text-sm inline-flex items-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                View Scanned Tag Profile
              </a>
              <button
                onClick={onClose}
                className="btn-ghost py-2.5 px-5 text-sm"
              >
                Close & Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

