import path from 'path';
const root = path.resolve(__dirname, '..', '..');
import preset from '@front-engine/tailwind-config';

export default {
    presets: [preset],
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        path.join(root, 'packages/panel/src/**/*.{js,ts,jsx,tsx,css}'),
        path.join(root, 'packages/ui/src/**/*.{js,ts,jsx,tsx,css}'),
        path.join(root, 'packages/tailwind-config/src/**/*.{js,ts,jsx,tsx,css}'),
        path.join(root, 'packages/utils-react/src/**/*.{js,ts,jsx,tsx,css}'),
    ],
}