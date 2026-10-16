import { useState } from 'react';
import {
  PawPrint,
  Syringe,
  Utensils,
  Bell,
  QrCode,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Shield,
  Heart
} from 'lucide-react';
import { TagProductPreview } from './TagProductPreview';

export type DemoTab = 'medical' | 'vaccines' | 'food' | 'reminders' | 'smart_tag';

interface InteractivePetDashboardDemoProps {
  onExploreSmartTag?: () => void;
  onExploreCare?: () => void;
}

export function InteractivePetDashboardDemo({
  onExploreSmartTag,
  onExploreCare,
}: InteractivePetDashboardDemoProps) {
  const [activeTab, setActiveTab] = useState<DemoTab>('medical');
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({
    'am-walk': true,
    'bruno-kibble': true,
    'flea-med': false,
    'evening-brush': false,
  });

  const toggleTask = (taskId: string) => {
    setCheckedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  return (
    <div className="relative mx-auto w-full max-w-5xl rounded-3xl border border-white/[0.12] bg-gradient-to-b from-ink-900/90 via-ink-850/90 to-ink-950 p-4 sm:p-7 shadow-2xl glass overflow-hidden">
      {/* Ambient background glow accents */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-ink-700/20 blur-3xl" />

      {/* Top Header bar: Pet profile card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300"
              alt="Bruno the Golden Retriever"
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl object-cover border-2 border-white/20 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white text-[10px] ring-2 ring-ink-900">
              <CheckCircle2 className="h-3 w-3" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg sm:text-xl font-bold text-ink-50">
                Bruno
              </h3>
              <span className="rounded-full bg-brand-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-brand-300 border border-brand-500/30">
                Golden Retriever
              </span>
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] font-medium text-ink-300">
                3 yrs • 31 kg
              </span>
            </div>
            <p className="text-xs text-ink-400 mt-0.5 flex items-center gap-1.5">
              <span>Tag ID: <strong className="font-mono text-ink-200">PZ-BRUNO902</strong></span>
              <span>•</span>
              <span className="text-emerald-400">Microchip #9851410023</span>
            </p>
          </div>
        </div>

        {/* Quick status pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-ink-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Status: <strong className="text-ink-100">All vaccines current</strong></span>
        </div>
      </div>

      {/* Interactive Tabs Navigation */}
      <div className="mt-5 flex overflow-x-auto pb-2 scrollbar-none gap-2 border-b border-white/[0.06] relative z-10">
        {[
          { id: 'medical', label: 'Medical History', icon: Heart },
          { id: 'vaccines', label: 'Vaccinations', icon: Syringe },
          { id: 'food', label: 'Diet & Nutrition', icon: Utensils },
          { id: 'reminders', label: 'Active Reminders', icon: Bell },
          { id: 'smart_tag', label: 'Smart Tag & QR', icon: QrCode },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DemoTab)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-white text-ink-950 shadow-md'
                  : 'bg-white/[0.04] text-ink-300 hover:text-ink-100 hover:bg-white/[0.08]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
              {tab.id === 'reminders' && (
                <span className={`grid h-4 w-4 place-items-center rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-ink-950 text-white' : 'bg-brand-500/20 text-brand-300'
                }`}>
                  2
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="mt-6 min-h-[310px] relative z-10">
        {/* TAB 1: MEDICAL */}
        {activeTab === 'medical' && (
          <div className="animate-fade-in space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                <span className="text-[11px] uppercase tracking-wider text-ink-400 font-semibold">Primary Vet Clinic</span>
                <p className="mt-1 font-bold text-ink-100 text-sm">Oakwood Animal Hospital</p>
                <p className="text-xs text-ink-400 mt-0.5">Dr. Sarah Jenkins • +1 (555) 392-1090</p>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                <span className="text-[11px] uppercase tracking-wider text-ink-400 font-semibold">Allergies & Sensitivities</span>
                <p className="mt-1 font-bold text-amber-300 text-sm">Poultry / Chicken Protein</p>
                <p className="text-xs text-ink-400 mt-0.5">Causes cutaneous itching; salmon only</p>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                <span className="text-[11px] uppercase tracking-wider text-ink-400 font-semibold">Weight Tracker</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-lg font-bold text-ink-100">31.2 kg</span>
                  <span className="text-xs text-emerald-400 font-medium">Optimal BMI range</span>
                </div>
                <p className="text-[11px] text-ink-400 mt-0.5">Last recorded: Oct 4, 2026</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-300">Recent Medical Visits & Clinical Notes</h4>
                <span className="text-[11px] text-ink-400 font-mono">3 records saved</span>
              </div>
              <div className="mt-3 space-y-2.5">
                {[
                  { date: 'Sep 18, 2026', title: 'Annual Wellness Exam & Bloodwork', vet: 'Dr. Jenkins', outcome: 'All clear. Teeth grade 1 clean. Heart rhythm healthy.' },
                  { date: 'May 12, 2026', title: 'Ear Cytology & Mild Yeast Cleanse', vet: 'Dr. Jenkins', outcome: 'Prescribed Otomax drops 7 days; completely resolved.' },
                  { date: 'Jan 22, 2026', title: 'Heartworm & Tick Antigen Screen', vet: 'Dr. Jenkins', outcome: 'Negative (4Dx Plus screen passed).' },
                ].map((rec, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 rounded-xl bg-ink-800/40 border border-white/[0.04] p-3 text-xs">
                    <div>
                      <p className="font-semibold text-ink-100">{rec.title}</p>
                      <p className="text-ink-400 text-[11px]">{rec.outcome}</p>
                    </div>
                    <div className="sm:text-right shrink-0 text-ink-400">
                      <span className="font-mono text-[11px] text-ink-300">{rec.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VACCINES */}
        {activeTab === 'vaccines' && (
          <div className="animate-fade-in space-y-4">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink-300">Vaccine Passport & Due Dates</h4>
                  <p className="text-[11px] text-ink-400 mt-0.5">Automated push alerts sync with your calendar</p>
                </div>
                <span className="chip border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[11px]">
                  100% Protected
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { name: 'Rabies (3-Year)', adminDate: 'Aug 14, 2024', dueDate: 'Aug 14, 2027', badge: 'Active', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
                  { name: 'DHPP / Core Distemper', adminDate: 'Sep 18, 2025', dueDate: 'Sep 18, 2028', badge: 'Active', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
                  { name: 'Bordetella (Kennel Cough)', adminDate: 'Mar 10, 2026', dueDate: 'Mar 10, 2027', badge: 'Active', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
                  { name: 'Leptospirosis 4-Way', adminDate: 'Apr 02, 2026', dueDate: 'Apr 02, 2027', badge: 'Active', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
                ].map((vax, idx) => (
                  <div key={idx} className="rounded-xl border border-white/[0.06] bg-ink-800/50 p-3.5 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Syringe className="h-3.5 w-3.5 text-brand-300" />
                        <span className="font-bold text-ink-100 text-xs sm:text-sm">{vax.name}</span>
                      </div>
                      <p className="text-[11px] text-ink-400 mt-2">
                        Administered: <span className="text-ink-200">{vax.adminDate}</span>
                      </p>
                      <p className="text-[11px] text-ink-400">
                        Next booster due: <span className="font-semibold text-brand-200">{vax.dueDate}</span>
                      </p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${vax.badgeColor}`}>
                      {vax.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FOOD & NUTRITION */}
        {activeTab === 'food' && (
          <div className="animate-fade-in space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-300 flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-brand-300" />
                  Daily Feeding Schedule
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center rounded-xl bg-ink-800/50 p-2.5 border border-white/[0.04]">
                    <div>
                      <span className="font-semibold text-ink-100">Breakfast (7:30 AM)</span>
                      <p className="text-[11px] text-ink-400">1.75 cups Salmon & Sweet Potato Kibble</p>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">Done</span>
                  </div>
                  <div className="flex justify-between items-center rounded-xl bg-ink-800/50 p-2.5 border border-white/[0.04]">
                    <div>
                      <span className="font-semibold text-ink-100">Dinner (6:30 PM)</span>
                      <p className="text-[11px] text-ink-400">1.75 cups Kibble + 1 pump Omega-3 Fish Oil</p>
                    </div>
                    <span className="text-[11px] font-mono text-brand-300 font-semibold">Upcoming</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-300 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-300" />
                  Strict Prohibitions & Toxicity Guard
                </span>
                <p className="text-xs text-ink-300 leading-relaxed">
                  Bruno is allergic to chicken. Also guarded by Petziq’s <strong>99 Plant & Household Food Toxicity Database</strong>:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['No Grapes / Raisins', 'No Xylitol / Gum', 'No Chocolate', 'No Cooked Bones', 'No Lilies'].map((item) => (
                    <span key={item} className="rounded-lg bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[10px] font-semibold text-red-300">
                      ✕ {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REMINDERS & CHECKLIST */}
        {activeTab === 'reminders' && (
          <div className="animate-fade-in space-y-4">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink-300">Today’s Interactive Checklist</h4>
                  <p className="text-[11px] text-ink-400">Tap checkboxes to mark items done in real time</p>
                </div>
                <span className="text-xs font-mono text-ink-400">
                  {Object.values(checkedTasks).filter(Boolean).length} / {Object.keys(checkedTasks).length} Completed
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {[
                  { id: 'am-walk', title: 'Morning 45-min Parkland Walk', time: '7:00 AM', tag: 'Exercise' },
                  { id: 'bruno-kibble', title: 'Morning Nutrition + Glucosamine chew', time: '7:45 AM', tag: 'Diet' },
                  { id: 'flea-med', title: 'Monthly NexGard Spectra Chew', time: '6:00 PM', tag: 'Medication' },
                  { id: 'evening-brush', title: 'Coat Brushing & Ear Check', time: '8:30 PM', tag: 'Grooming' },
                ].map((task) => {
                  const isDone = checkedTasks[task.id];
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`flex items-center justify-between rounded-xl p-3 border transition cursor-pointer ${
                        isDone
                          ? 'border-emerald-500/30 bg-emerald-500/10'
                          : 'border-white/[0.06] bg-ink-800/40 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-5 w-5 rounded-lg border flex items-center justify-center transition ${
                          isDone ? 'border-emerald-400 bg-emerald-500 text-white' : 'border-white/20 bg-ink-900'
                        }`}>
                          {isDone && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </div>
                        <div>
                          <p className={`text-xs font-semibold ${isDone ? 'line-through text-ink-400' : 'text-ink-100'}`}>
                            {task.title}
                          </p>
                          <span className="text-[10px] text-ink-400 font-mono">{task.time}</span>
                        </div>
                      </div>
                      <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-ink-300">
                        {task.tag}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SMART TAG & EMERGENCY QR */}
        {activeTab === 'smart_tag' && (
          <div className="animate-fade-in grid gap-6 md:grid-cols-2 items-center">
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-white/[0.08] bg-ink-850/60">
              <TagProductPreview
                petName="Bruno"
                tagId="PZ-BRUNO902"
                shape="round"
                color="black"
                side="front"
              />
              <p className="mt-3 text-center text-xs text-ink-400">
                Precision laser-engraved QR • Instant scanning with any smartphone camera
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-300">Scanned Finder Experience</span>
                <p className="mt-1 text-ink-200 leading-relaxed">
                  If Bruno ever wanders off, anyone who scans this collar tag immediately sees your emergency phone number, medical alerts, and vet clinic without downloading any app.
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-ink-400">Emergency Phone</span>
                  <span className="font-mono text-ink-100 font-semibold">+1 (555) 802-9411</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-400">Reward Status</span>
                  <span className="text-emerald-400 font-semibold">Active Reward Offered</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-400">Hardware Warranty</span>
                  <span className="text-ink-200 font-semibold">Lifetime Acrylic Guarantee</span>
                </div>
              </div>

              {onExploreSmartTag && (
                <button
                  onClick={onExploreSmartTag}
                  className="btn-primary w-full justify-center text-xs"
                >
                  Configure Bruno's Physical Smart Tag &rarr;
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Bottom Footer */}
      <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-400">
        <span className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-brand-300" />
          <span>Interactive preview based on Petziq’s real pet management engine.</span>
        </span>
        <div className="flex items-center gap-2">
          {onExploreCare && (
            <button onClick={onExploreCare} className="text-brand-300 hover:text-white transition">
              Explore Care Guides &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
