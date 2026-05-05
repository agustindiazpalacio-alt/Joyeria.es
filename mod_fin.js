const fs = require('fs');

const file = 'src/pages/Finances.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import Tooltip from')) {
    content = content.replace("import AiPanel from '../components/AiPanel';", "import AiPanel from '../components/AiPanel';\nimport Tooltip from '../components/Tooltip';");
}

let replacements = [
  {
    find: '<label className="text-xs text-zinc-500">Com. Cobro (%)</label>',
    replace: '<label className="text-xs text-zinc-500 flex items-center">Com. Cobro (%)<Tooltip text="Comisión del medio de pago (ej. 8% MercadoPago)" /></label>'
  },
  {
    find: '<label className="text-xs text-zinc-500">Caja/Envío ($)</label>',
    replace: '<label className="text-xs text-zinc-500 flex items-center">Caja/Envío ($)<Tooltip text="Costo del packaging + extras por envío" /></label>'
  },
  {
    find: '<label className="text-xs text-zinc-500">Markup (x)</label>',
    replace: '<label className="text-xs text-zinc-500 flex items-center">Markup (x)<Tooltip text="Multiplicador. Si te cuesta 100 y quieres venderlo a 300, el markup es 3" /></label>'
  },
  {
    find: '<label className="text-xs text-zinc-500">Costos extra(%)</label>',
    replace: '<label className="text-xs text-zinc-500 flex items-center">Costos extra(%)<Tooltip text="Suma comisiones, envíos absorbidos, etc." /></label>'
  },
  {
    find: '<label className="text-xs text-zinc-500">Margen Prom. (%)</label>',
    replace: '<label className="text-xs text-zinc-500 flex items-center">Margen Prom. (%)<Tooltip text="Margen de ganancia de tu tienda (ej. 60%)" /></label>'
  },
  {
      find: '<label className="text-xs text-zinc-500">Costo FOB (USD)</label>',
      replace: '<label className="text-xs text-zinc-500 flex items-center">Costo FOB (USD)<Tooltip text="Precio en origen (China/Alibaba)" /></label>'
  },
  {
      find: '<label className="text-xs text-zinc-500">Coeficiente</label>',
      replace: '<label className="text-xs text-zinc-500 flex items-center">Coeficiente<Tooltip text="Multiplicador para calcular precio final en Argentina (aprox 2 a 2.5)" /></label>'
  }
];

replacements.forEach(r => {
    content = content.replace(r.find, r.replace);
});

fs.writeFileSync(file, content, 'utf8');
