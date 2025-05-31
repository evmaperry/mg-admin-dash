import {
  mdiHome,
  mdiFerrisWheel,
  mdiFood,
  mdiMicrophone,
  mdiBeer,
  mdiGlassWine,
  mdiPartyPopper,
} from '@mdi/js';

const labelSelectorConfig: {
  [category: string]: { [type: string]: { iconRaw: string; icon: string } };
} = {
  'Food_&_drink': {
    Food: { iconRaw: mdiFood, icon: 'food' },
    Beer: { iconRaw: mdiBeer, icon: 'beer' },
    Wine: { iconRaw: mdiGlassWine, icon: 'glass-wine' },
  },
  Entertainment: {
    Microphone: { iconRaw: mdiMicrophone, icon: 'microphone' },
    Ferris_wheel: { iconRaw: mdiFerrisWheel, icon: 'ferris-wheel' },
  },
  Other: {
    Home: { iconRaw: mdiHome, icon: 'home' },
    Party: {iconRaw: mdiPartyPopper, icon: 'party-popper'},

  },
};


const labelRawIcons:{[icon:string]: string} = {
  'food': mdiFood,
  'beer': mdiBeer,
  'glass-wine': mdiGlassWine,
  'microphone': mdiMicrophone,
  'ferris-wheel': mdiFerrisWheel,
  'home': mdiHome,
  'party-popper': mdiPartyPopper,
}


export { labelSelectorConfig, labelRawIcons};
