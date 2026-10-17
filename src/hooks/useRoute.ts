import { useCallback, useEffect, useState } from 'react';

function parseHash(): string {
  const h = window.location.hash.replace(/^#/, '');
  return h || '/';
}

export function useRoute(): [string, (to: string) => void] {
  const [path, setPath] = useState<string>(parseHash());

  useEffect(() => {
    const onChange = () => {
      setPath(parseHash());
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((to: string) => {
    const target = to.startsWith('/') ? to : `/${to}`;
    if (window.location.hash !== `#${target}`) {
      window.location.hash = target;
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return [path, navigate];
}

export function parseRoute(path: string): {
  page: string;
  params: Record<string, string>;
} {
  const segments = path.split('/').filter(Boolean);
  const params: Record<string, string> = {};
  let page = 'home';

  if (segments.length === 0) {
    page = 'home';
  } else if (segments[0] === 'explore') {
    page = 'explore';
    if (segments[1]) params.category = segments[1];
  } else if (segments[0] === 'categories') {
    page = 'categories';
    if (segments[1]) params.category = segments[1];
  } else if (segments[0] === 'breed') {
    page = 'breed';
    if (segments[1]) params.id = segments[1];
  } else if (segments[0] === 'plants') {
    page = 'plants';
    if (segments[1]) params.id = segments[1];
  } else if (segments[0] === 'reminders') {
    page = 'reminders';
  } else if (segments[0] === 'care') {
    page = 'care';
    if (segments[1]) params.guide = segments[1];
  } else if (segments[0] === 'food') {
    page = 'food';
    if (segments[1]) params.id = segments[1];
  } else if (segments[0] === 'problems') {
    page = 'problems';
  } else if (segments[0] === 'favorites') {
    page = 'favorites';
  } else if (segments[0] === 'my-pets') {
    page = 'my-pets';
    if (segments[1]) params.id = segments[1];
  } else if (segments[0] === 'my-plants') {
    page = 'my-plants';
  } else if (segments[0] === 'dashboard') {
    page = 'dashboard';
  } else if (segments[0] === 'activity') {
    page = 'activity';
  } else if (segments[0] === 'progress') {
    page = 'progress';
  } else if (segments[0] === 'blog') {
    page = 'blog';
    if (segments[1]) params.id = segments[1];
  } else if (segments[0] === 'about') {
    page = 'about';
  } else if (segments[0] === 'plus') {
    page = 'plus';
  } else if (segments[0] === 'smart-tags') {
    page = 'smart-tags';
    if (segments[1] === 'create') {
      page = 'smart-tags-create';
    } else if (segments[1] === 'edit') {
      page = 'smart-tags-edit';
      if (segments[2]) params.id = segments[2];
    }
  } else if (segments[0] === 'find-pet') {
    page = 'find-pet';
    if (segments[1]) params.tagId = segments[1];
  } else if (segments[0] === 'tag') {
    page = 'tag';
    if (segments[1]) params.tagId = segments[1];
  } else if (segments[0] === 'admin') {
    if (segments.length === 1) {
      page = 'admin';
    } else if (segments[1] === 'orders') {
      page = 'admin-orders';
      if (segments[2]) params.id = segments[2];
    } else if (segments[1] === 'smart-tags') {
      page = 'admin-tags';
      if (segments[2]) params.tagId = segments[2];
    } else if (segments[1] === 'customers') {
      page = 'admin-customers';
    } else if (segments[1] === 'pets') {
      page = 'admin-pets';
    } else if (segments[1] === 'plants') {
      page = 'admin-plants';
    } else if (segments[1] === 'animal-database') {
      page = 'admin-animal-database';
    } else if (segments[1] === 'settings') {
      page = 'admin-settings';
    } else {
      page = 'notfound';
    }
  } else if (segments[0] === 'contact' || segments[0] === 'help') {
    // Contact and Help are linked from the navbar, sidebar and footer but have
    // no dedicated route yet. The About page carries the Contact/support
    // section, so map them there instead of dead-ending on a blank page.
    page = 'about';
  } else {
    page = 'notfound';
  }

  return { page, params };
}
