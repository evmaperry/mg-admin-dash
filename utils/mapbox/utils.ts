export const convertMapThemeToStyleURL = (theme: 'light' | 'dark' | 'outdoors' | 'streets') => {
  switch (theme) {
    case 'light':
      return 'mapbox://styles/mapbox/light-v11'
      break;
    case 'dark' :
      return 'mapbox://styles/mapbox/dark-v11';
      break;
   case 'streets':
      return 'mapbox://styles/mapbox/streets-v12'
      break;
    case 'outdoors' :
      return 'mapbox://styles/mapbox/outdoors-v11';
      break;

  }
}