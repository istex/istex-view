const searchParams = new URLSearchParams(window.location.search);

export const IS_DEBUG = searchParams.has("debug");
