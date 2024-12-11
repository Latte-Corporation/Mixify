import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async () => {
  // Use the navigator's language
  const locale = (navigator.language || 'en').split('-')[0];

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default
  };
});
