import React, { useState } from 'react';
import { Calculator, AlertCircle, CheckCircle2 } from 'lucide-react';
import AiPanel from '../components/AiPanel';
import Tooltip from '../components/Tooltip';

export default function Finances() {
  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-3xl font-serif font-bold golden-text-gradient mb-1">Finanzas y Calculadoras</h1>
        <p className="text-brand-400 text-sm">Herramientas financieras esenciales para rentabilidad en Argentina (2026).</p>
      </div>
      
      <AiPanel 
        title="Asistente: Contador Virtual"
        description="Analiza tus costos, comisiones y rentabilidad global."
        systemPrompt="Eres un CFO y Contador Experto en e-commerce. Especialista en estructura de costos de MercadoPago, Tiendanube, Monotributo, ingresos brutos y Meta Ads en Argentina. El usuario te describirá su situación financiera, y tú debes realizar cálculos rápidos, detectar si está vendiendo a pérdida (venta con rentabilidad negativa) y dar consejos muy concisos para maximizar el ROAS y las ganancias netas."
        placeholder="Ej: Si compro 100 anillos a $2.000, los vendo a $10.000 pero absorbo un envío gratis de $4.500 y pago 8% a MercadoPago, ¿cuál es mi margen neto?"
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CalcRetailPrice />
        <CalcReverseMargin />
        <CalcBreakEven />
        <CalcFreeShipping />
        <CalcTaxes />
        <CalcCashFlow />
        <CalcROAS />
        <CalcROICampaign />
        <CalcInitialBudget />
        <CalcBuy3Pay2 />
        <CalcInventoryVelocity />
        <CalcOnceVsChina />
      </div>
    </div>
  );
}

function CalcBox({ title, description, children }: { title: string, description?: string, children: React.ReactNode }) {
  return (
    <div className="premium-card p-5 h-full flex flex-col justify-between group">
      <div>
        <h3 className="text-lg font-serif font-bold text-[var(--color-brand-100)] mb-2 flex items-center gap-2 group-hover:text-[var(--color-gold)] transition-colors">
          <Calculator className="w-5 h-5 text-[var(--color-gold)] group-hover:text-[var(--color-gold-hover)] transition-colors" /> {title}
        </h3>
        {description && <p className="text-sm text-[var(--color-brand-400)] mb-4 leading-relaxed">{description}</p>}
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

function ResultBadge({ type, text }: { type: 'success'|'warning'|'danger', text: string }) {
  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;
  return (
    <div className={`mt-5 p-3 rounded-xl border flex items-center gap-3 transition-all badge-${type}`}>
      <Icon className="w-5 h-5 shrink-0" />
      <span className="font-medium text-[13px] leading-tight text-inherit">{text}</span>
    </div>
  );
}

function CalcRetailPrice() {
  const [cost, setCost] = useState(2000);
  const [packaging, setPackaging] = useState(300);
  const [mp, setMp] = useState(8); 
  const [taxes, setTaxes] = useState(4); 
  const [markup, setMarkup] = useState(2.5); 
  const [isCalculated, setIsCalculated] = useState(true);

  const suggestedPrice = cost * markup;
  const mpCost = suggestedPrice * (mp / 100);
  const taxesCost = suggestedPrice * (taxes / 100);
  const netProfit = suggestedPrice - cost - packaging - mpCost - taxesCost;
  const marginStr = ((netProfit / suggestedPrice) * 100).toFixed(1);

  const handleChange = (setter: any) => (e: any) => {
     setter(Number(e.target.value));
     setIsCalculated(false);
  };

  const calculate = (e: React.FormEvent) => {
     e.preventDefault();
     setIsCalculated(true);
  };

  return (
    <CalcBox 
      title="1. Precio Minorista Final" 
      description="Te dice a qué precio ofrecer un producto para tener ganancia real después de considerar packaging, lo que cobra MercadoPago o cualquier otra plataforma, y los impuestos. Es esencial para no vender a pérdida sin darte cuenta."
    >
      <form onSubmit={calculate} className="space-y-4">
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Costo ($)<Tooltip text="Costo base que le pagas a tu proveedor por unidad. Ej: $1500 por un anillo de acero." /></label><input type="number" required value={cost} onChange={handleChange(setCost)} className="premium-input w-full p-2.5 text-sm" /></div>
          <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Caja/Envío ($)<Tooltip text="Costo promediado de packaging o envíos absorbidos. Ej: $300 por una cajita con logo." /></label><input type="number" required value={packaging} onChange={handleChange(setPackaging)} className="premium-input w-full p-2.5 text-sm" /></div>
          <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Comisión Pago (%)<Tooltip text="Porcentaje que te cobra MercadoPago, Ualá, etc. Ej: 8% con MercadoPago Point." /></label><input type="number" required value={mp} onChange={handleChange(setMp)} className="premium-input w-full p-2.5 text-sm" /></div>
          <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Markup (Multipl.)<Tooltip text="¿Por cuánto multiplicas el costo? Standard en joyería es 2.5 a 4. Ej: 3x para triplicar." /></label><input type="number" step="0.1" required value={markup} onChange={handleChange(setMarkup)} className="premium-input w-full p-2.5 text-sm" /></div>
        </div>
        {!isCalculated ? (
          <button type="submit" className="golden-button w-full py-2.5 rounded-xl font-bold text-sm">Calcular Precio Sugerido</button>
        ) : (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="pt-4 border-t border-brand-800/80 space-y-2">
              <div className="flex justify-between items-center"><span className="text-sm text-brand-400">Precio Sugerido:</span> <span className="font-mono text-lg font-bold text-brand-100">${Math.round(suggestedPrice).toLocaleString('es-AR')}</span></div>
              <div className="flex justify-between items-center"><span className="text-sm text-brand-400">Ganancia Neta:</span> <span className={`font-mono text-lg font-bold ${netProfit > 0 ? 'text-emerald-700' : 'text-red-700'}`}>${Math.round(netProfit).toLocaleString('es-AR')} <span className="text-xs font-normal">({marginStr}%)</span></span></div>
            </div>
            <ResultBadge type={netProfit > 0 ? 'success' : 'danger'} text={netProfit > 0 ? `Margen saludable. Estás ganando $${Math.round(netProfit)} limpios.` : 'Estás vendiendo a pérdida.'} />
          </div>
        )}
      </form>
    </CalcBox>
  );
}

function CalcReverseMargin() {
  const [price, setPrice] = useState(12000);
  const [cost, setCost] = useState(4000);
  const [fees, setFees] = useState(15); 
  const [isCalculated, setIsCalculated] = useState(true);

  const net = price - cost - (price * (fees/100));
  const isGood = net > (cost * 0.6); 

  const handleChange = (setter: any) => (e: any) => {
     setter(Number(e.target.value));
     setIsCalculated(false);
  };

  const calculate = (e: React.FormEvent) => {
     e.preventDefault();
     setIsCalculated(true);
  };

  return (
    <CalcBox 
      title="2. Margen Inverso (Top-Down)"
      description="Si tienes que vender sí o sí a un precio de mercado ('lo voy a vender a $12,000 porque eso cobra la competencia'), esta calculadora te informa cuánto estarás ganando realmente por unidad descontando tu costo y extras."
    >
      <form onSubmit={calculate} className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1"><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Precio Vta ($)<Tooltip text="Precio al que planeas vender el producto. Ej: $12000 precio final al público." /></label><input type="number" required value={price} onChange={handleChange(setPrice)} className="premium-input w-full p-2.5 text-sm" /></div>
          <div className="col-span-1"><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Costo ($)<Tooltip text="Lo que pagaste por el producto en el mayorista. Ej: $4000 costo proveedor." /></label><input type="number" required value={cost} onChange={handleChange(setCost)} className="premium-input w-full p-2.5 text-sm" /></div>
          <div className="col-span-1"><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Costos extra(%)<Tooltip text="Comisiones de plataforma + impuestos sumados. Ej: 15% (8% MP + 7% envío)." /></label><input type="number" required value={fees} onChange={handleChange(setFees)} className="premium-input w-full p-2.5 text-sm" /></div>
        </div>
        {!isCalculated ? (
          <button type="submit" className="golden-button w-full py-2.5 rounded-xl font-bold text-sm">Calcular Margen Inverso</button>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <ResultBadge 
              type={net < 0 ? 'danger' : (isGood ? 'success' : 'warning')} 
              text={net < 0 ? `Estás perdiendo $${Math.abs(Math.round(net))} por unidad.` : `Ganancia de $${Math.round(net)}. Margen Neto: ${((net/price)*100).toFixed(1)}%.`} 
            />
          </div>
        )}
      </form>
    </CalcBox>
  );
}

function CalcBreakEven() {
  const [fixedCosts, setFixedCosts] = useState(150000); 
  const [avgTicket, setAvgTicket] = useState(18000);
  const [avgMarginPercent, setAvgMarginPercent] = useState(40); 
  const [isCalculated, setIsCalculated] = useState(true);

  const avgProfit = avgTicket * (avgMarginPercent / 100);
  const requiredSales = avgProfit > 0 ? fixedCosts / avgProfit : 0;
  const breakEvenRevenue = requiredSales * avgTicket;

  const handleChange = (setter: any) => (e: any) => {
     setter(Number(e.target.value));
     setIsCalculated(false);
  };

  const calculate = (e: React.FormEvent) => {
     e.preventDefault();
     setIsCalculated(true);
  };

  return (
    <CalcBox 
      title="3. Punto de Equilibrio (Break-Even)"
      description="Calcula exactamente cuántas ventas o qué monto necesitas alcanzar cada mes solo para pagar tus costos fijos (alquiler, monotributo, servicios). Menos de esto es pérdida; más de esto es ganancia pura."
    >
      <form onSubmit={calculate} className="space-y-4">
        <div className="grid grid-cols-3 gap-3 mb-2">
          <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Costos Fijos ($)<Tooltip text="Gastos mensuales obligatorios. Ej: $150.000 entre alquiler, internet y monotributo." /></label><input type="number" required value={fixedCosts} onChange={handleChange(setFixedCosts)} className="premium-input w-full p-2.5 text-sm" /></div>
          <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Ticket Prom. ($)<Tooltip text="Valor promedio que gasta un cliente en una compra (AOV). Ej: $18.000 por persona." /></label><input type="number" required value={avgTicket} onChange={handleChange(setAvgTicket)} className="premium-input w-full p-2.5 text-sm" /></div>
          <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Margen Neto (%)<Tooltip text="Tu ganancia final promedio de cada venta. Ej: 40% después de costos." /></label><input type="number" required value={avgMarginPercent} onChange={handleChange(setAvgMarginPercent)} className="premium-input w-full p-2.5 text-sm" /></div>
        </div>
        {!isCalculated ? (
          <button type="submit" className="golden-button w-full py-2.5 rounded-xl font-bold text-sm">Calcular Breakeven</button>
        ) : (
          <div className="pt-2 animate-in fade-in zoom-in-95 duration-300">
            <p className="flex justify-between items-center text-sm mb-2 text-brand-400">Ventas necesarias para cubrir fijos:</p>
            <div className="flex items-center gap-4">
              <span className="font-mono text-2xl font-bold text-amber-700">{Math.ceil(requiredSales)} ventas</span>
              <span className="font-mono text-sm text-brand-500">($ {Math.round(breakEvenRevenue).toLocaleString('es-AR')})</span>
            </div>
            <ResultBadge type={requiredSales > 100 ? 'warning' : 'success'} text={requiredSales > 100 ? 'Peligro: Necesitas demasiadas ventas solo para mantenerte a flote.' : 'Equilibrio alcanzable y realista con tu nivel de costos fijos.'} />
          </div>
        )}
      </form>
    </CalcBox>
  );
}

function CalcFreeShipping() {
  const [avgMargin, setAvgMargin] = useState(45); 
  const [shippingCost, setShippingCost] = useState(4500);
  const [isCalculated, setIsCalculated] = useState(true);

  const requiredTicket = avgMargin > 0 ? shippingCost / (avgMargin / 100) : 0;

  const handleChange = (setter: any) => (e: any) => {
     setter(Number(e.target.value));
     setIsCalculated(false);
  };

  const calculate = (e: React.FormEvent) => {
     e.preventDefault();
     setIsCalculated(true);
  };

  return (
    <CalcBox 
      title="4. Umbral de Envío Gratis"
      description="Te ayuda a definir el 'Envío gratis a partir de X monto'. Te asegura que el margen que ganas en ese carrito gigante sea suficiente para pagar el envío logístico sin quebrar tu rentabilidad."
    >
      <form onSubmit={calculate} className="space-y-4">
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Costo Envío o Correo ($)<Tooltip text="Lo que te cuesta el envío logístico. Ej: $4500 tarifa plana de Correo Argentino." /></label><input type="number" required value={shippingCost} onChange={handleChange(setShippingCost)} className="premium-input w-full p-2.5 text-sm" /></div>
          <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Margen N. Promedio (%)<Tooltip text="Tu ganancia neta promedio para toda la tienda. Ej: 45% de rentabilidad neta." /></label><input type="number" required value={avgMargin} onChange={handleChange(setAvgMargin)} className="premium-input w-full p-2.5 text-sm" /></div>
        </div>
        {!isCalculated ? (
          <button type="submit" className="golden-button w-full py-2.5 rounded-xl font-bold text-sm">Calcular Umbral Mínimo</button>
        ) : (
          <div className="pt-2 animate-in fade-in zoom-in-95 duration-300">
            <p className="text-sm font-medium mb-1 text-brand-400">Mínimo de compra sugerido (para no perder dinero):</p>
            <p className="font-mono text-2xl font-bold text-emerald-400">${Math.round(requiredTicket).toLocaleString('es-AR')}</p>
            <p className="text-[11px] text-brand-500 mt-2">Si das envío gratis a carritos menores a este valor, tus costos logísticos superarán la rentabilidad de las joyas.</p>
            <ResultBadge type={requiredTicket > 30000 ? 'warning' : 'success'} text={requiredTicket > 30000 ? 'El monto es muy alto. Intenta absorber parte enviando por métodos más económicos.' : 'Umbral accesible. Incentivará a los clientes a agregar más productos al carrito.'} />
          </div>
        )}
      </form>
    </CalcBox>
  );
}

function CalcTaxes() {
  const [monthlySales, setMonthlySales] = useState(600000);
  const [iibbPercent, setIibbPercent] = useState(3.5); 
  const [isCalculated, setIsCalculated] = useState(true);

  // Very rough estimate for AR monotributo brackets 2026 
  const estimatedMonotributo = monthlySales < 300000 ? 12000 : monthlySales < 600000 ? 25000 : 45000;
  const iibbCost = monthlySales * (iibbPercent / 100);
  const totalTaxes = estimatedMonotributo + iibbCost;
  const taxBurden = monthlySales > 0 ? ((totalTaxes / monthlySales) * 100).toFixed(1) : "0";

  const handleChange = (setter: any) => (e: any) => {
     setter(Number(e.target.value));
     setIsCalculated(false);
  };

  const calculate = (e: React.FormEvent) => {
     e.preventDefault();
     setIsCalculated(true);
  };

  return (
    <CalcBox 
      title="5. Calculadora de Impuestos (M.T. / IIBB)"
      description="Estima cuánto pagarás de Monotributo e Ingresos Brutos según tu facturación bruta. Vital en Argentina para no llevarse sorpresas a fin de mes ni evadir sin saber tu carga de impuestos real."
    >
      <form onSubmit={calculate} className="space-y-4">
        <div className="grid grid-cols-2 gap-3 mb-2">
           <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Ingreso Mensual ($)<Tooltip text="Facturación bruta mensual proyectada. Ej: $600.000 de ventas totales en el mes." /></label><input type="number" required value={monthlySales} onChange={handleChange(setMonthlySales)} className="premium-input w-full p-2.5 text-sm" /></div>
           <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Alícuota IIBB (%)<Tooltip text="Ingresos Brutos varía por provincia. Ej: 3.5% en Provincia de Buenos Aires." /></label><input type="number" step="0.1" required value={iibbPercent} onChange={handleChange(setIibbPercent)} className="premium-input w-full p-2.5 text-sm" /></div>
        </div>
        {!isCalculated ? (
          <button type="submit" className="golden-button w-full py-2.5 rounded-xl font-bold text-sm">Calcular Ajuste de Impuestos</button>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="space-y-2 mt-4 text-sm text-brand-300">
               <div className="flex justify-between"><span>Monotributo Est. Mensual:</span> <span className="font-mono text-brand-400">$ {estimatedMonotributo.toLocaleString('es-AR')}</span></div>
               <div className="flex justify-between border-b border-brand-800/80 pb-2"><span>IIBB Estimado:</span> <span className="font-mono text-brand-400">$ {Math.round(iibbCost).toLocaleString('es-AR')}</span></div>
               <div className="flex justify-between font-bold pt-1"><span>Carga Tributaria Total:</span> <span className="font-mono text-red-400">$ {Math.round(totalTaxes).toLocaleString('es-AR')}</span></div>
            </div>
            <ResultBadge type={Number(taxBurden) > 10 ? 'warning' : 'success'} text={`La presión fiscal representa un ${taxBurden}% de tus ventas brutas.`} />
          </div>
        )}
      </form>
    </CalcBox>
  );
}

function CalcCashFlow() {
  const [openingBalance, setOpeningBalance] = useState(50000);
  const [income, setIncome] = useState(300000);
  const [expenses, setExpenses] = useState(210000);
  const [isCalculated, setIsCalculated] = useState(true);

  const closingBalance = openingBalance + income - expenses;

  const handleChange = (setter: any) => (e: any) => {
     setter(Number(e.target.value));
     setIsCalculated(false);
  };

  const calculate = (e: React.FormEvent) => {
     e.preventDefault();
     setIsCalculated(true);
  };

  return (
    <CalcBox 
      title="6. Proyección Flujo de Caja (Cash Flow)"
      description="Tu caja no es lo mismo que tus ganancias. Si pagas de contado pero cobras a plazos, puedes quedarte sin dinero. Esta calculadora predice si tendrás plata física en la cuenta a fin de mes."
    >
      <form onSubmit={calculate} className="space-y-4">
        <div className="grid grid-cols-3 gap-3 mb-2">
          <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Caja Inicial ($)<Tooltip text="Capital disponible a fin del mes anterior. Ej: $50.000 en tu cuenta bancaria." /></label><input type="number" required value={openingBalance} onChange={handleChange(setOpeningBalance)} className="premium-input w-full p-2.5 text-sm" /></div>
          <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Ingresos ($)<Tooltip text="Ventas o recaudación total proyectada este mes. Ej: $300.000 facturados." /></label><input type="number" required value={income} onChange={handleChange(setIncome)} className="premium-input w-full p-2.5 text-sm" /></div>
          <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Egresos ($)<Tooltip text="Total de gastos mensuales (mercadería, sueldos). Ej: $210.000 de pago a mayoristas." /></label><input type="number" required value={expenses} onChange={handleChange(setExpenses)} className="premium-input w-full p-2.5 text-sm" /></div>
        </div>
        {!isCalculated ? (
          <button type="submit" className="golden-button w-full py-2.5 rounded-xl font-bold text-sm">Calcular Flujo De Caja</button>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="mt-4 p-4 border border-brand-800 rounded-xl bg-brand-950/50">
              <p className="text-[11px] text-brand-500 uppercase tracking-widest font-bold mb-1">Saldo Final Proyectado</p>
              <p className={`font-mono text-3xl font-bold ${closingBalance < 0 ? 'text-red-700' : 'text-emerald-400'}`}>${closingBalance.toLocaleString('es-AR')}</p>
            </div>
            <ResultBadge type={closingBalance < 0 ? 'danger' : 'success'} text={closingBalance < 0 ? 'Riesgo de quiebra de caja.' : 'Excelente proyección, tu caja es positiva.'} />
          </div>
        )}
      </form>
    </CalcBox>
  );
}

function CalcROAS() {
  const [spend, setSpend] = useState(50000);
  const [revenue, setRevenue] = useState(210000);
  const [isCalculated, setIsCalculated] = useState(true);

  const roas = spend > 0 ? (revenue / spend) : 0;

  const handleChange = (setter: any) => (e: any) => {
     setter(Number(e.target.value));
     setIsCalculated(false);
  };

  const calculate = (e: React.FormEvent) => {
     e.preventDefault();
     setIsCalculated(true);
  };

  return (
    <CalcBox 
      title="7. Análisis ROAS (Meta Ads)"
      description="Return on Ad Spend: Si pones $1 en publicidad, ¿cuántos pesos te devuelve en ventas? Mide si tu marketing está siendo eficiente o quemando plata."
    >
      <form onSubmit={calculate} className="space-y-4">
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Inversión Publicitaria ($)<Tooltip text="Dinero gastado en Meta/Google Ads. Ej: $50.000 pauta mensual en Instagram." /></label><input type="number" required value={spend} onChange={handleChange(setSpend)} className="premium-input w-full p-2.5 text-sm" /></div>
          <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Ventas Generadas ($)<Tooltip text="Facturación resultante directa de esas campañas de Ads. Ej: $210.000 por esos anuncios." /></label><input type="number" required value={revenue} onChange={handleChange(setRevenue)} className="premium-input w-full p-2.5 text-sm" /></div>
        </div>
        {!isCalculated ? (
          <button type="submit" className="golden-button w-full py-2.5 rounded-xl font-bold text-sm">Calcular ROAS</button>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <ResultBadge 
              type={roas < 2 ? 'danger' : (roas > 4 ? 'success' : 'warning')} 
              text={`Tu multiplicador (ROAS) es ${roas.toFixed(2)}x. ${roas < 2 ? 'Peligro: El costo de adquirir cliente es muy alto.' : roas > 4 ? 'Escala agresivamente esta campaña.' : 'Rendimiento aceptable, pero optimizable.'}`} 
            />
          </div>
        )}
      </form>
    </CalcBox>
  );
}

function CalcROICampaign() {
  const [budget, setBudget] = useState(100000);
  const [ticket, setTicket] = useState(18000);
  const [cpa, setCpa] = useState(5000);
  const [isCalculated, setIsCalculated] = useState(true);

  const estimatedSales = cpa > 0 ? Math.floor(budget / cpa) : 0;
  const grossRevenue = estimatedSales * ticket;

  const handleChange = (setter: any) => (e: any) => {
     setter(Number(e.target.value));
     setIsCalculated(false);
  };

  const calculate = (e: React.FormEvent) => {
     e.preventDefault();
     setIsCalculated(true);
  };

  return (
    <CalcBox 
      title="8. ROI Campaña y CAC"
      description="Compara tu Presupuesto Mensual contra tu Costo de Adquisición de Cliente (CAC). Cuánto de tu margen bruto se te va a ir en pagarle a Facebook/Instagram para conseguir ese comprador."
    >
      <form onSubmit={calculate} className="space-y-4">
         <div className="grid grid-cols-3 gap-3 mb-2">
             <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Ppto Mensual ($)<Tooltip text="Presupuesto que dedicarás mensualmente. Ej: $100.000 para Meta Ads." /></label><input type="number" required value={budget} onChange={handleChange(setBudget)} className="premium-input w-full p-2.5 text-sm" /></div>
             <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Costo Adquis. (CPA)<Tooltip text="Costo x Compra estimado. Ej: $5000 ARG para conseguir un cliente nuevo." /></label><input type="number" required value={cpa} onChange={handleChange(setCpa)} className="premium-input w-full p-2.5 text-sm" /></div>
             <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">AOV (Ticket) ($)<Tooltip text="Ticket promedio. Ej: $18.000 que compra de media cada cliente que entra por anuncio." /></label><input type="number" required value={ticket} onChange={handleChange(setTicket)} className="premium-input w-full p-2.5 text-sm" /></div>
         </div>
         {!isCalculated ? (
           <button type="submit" className="golden-button w-full py-2.5 rounded-xl font-bold text-sm">Calcular Proyección</button>
         ) : (
           <div className="pt-4 space-y-2 animate-in fade-in zoom-in-95 duration-300">
             <div className="flex justify-between text-sm text-brand-400">Ventas Proyectadas: <strong className="text-brand-100 font-mono">{estimatedSales} transacciones</strong></div>
             <div className="flex justify-between text-sm text-brand-400">Retorno Bruto: <strong className="text-emerald-400 font-mono">$ {grossRevenue.toLocaleString('es-AR')}</strong></div>
           </div>
         )}
      </form>
    </CalcBox>
  );
}

function CalcInitialBudget() {
  const [budget, setBudget] = useState(300000);
  const [isCalculated, setIsCalculated] = useState(true);
  
  const stock = budget * 0.5;
  const packaging = budget * 0.15;
  const ads = budget * 0.35;
  const estimUnits = Math.floor(stock / 3000); 

  const handleChange = (setter: any) => (e: any) => {
     setter(Number(e.target.value));
     setIsCalculated(false);
  };

  const calculate = (e: React.FormEvent) => {
     e.preventDefault();
     setIsCalculated(true);
  };

  return (
    <CalcBox 
      title="9. Setup Presupuesto Inicial Joyería"
      description="Si tienes un capital inicial fijo, te sugiere cómo distribuirlo inteligentemente entre compra de inventario mayorista, packaging, tienda online y pauta, en lugar de gastarlo todo en mercadería que luego no sabés cómo vender."
    >
      <form onSubmit={calculate} className="space-y-4 flex flex-col h-full">
        <div className="mb-4">
          <label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Capital Total Disponbile ($ ARS)<Tooltip text="Capital neto que tienes para invertir en el proyecto. Ej: $300.000 listos para invertir." /></label>
          <input type="number" required value={budget} onChange={handleChange(setBudget)} className="premium-input w-full p-2.5 text-sm" />
        </div>
        {!isCalculated ? (
          <button type="submit" className="golden-button w-full py-2.5 rounded-xl font-bold text-sm">Calcular Distribución</button>
        ) : (
          <div className="space-y-3 text-sm flex-1 animate-in fade-in zoom-in-95 duration-300">
             <div className="flex justify-between p-2 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                <span className="text-brand-300">50% Compra Inicial Mayorista:</span> 
                <strong className="font-mono text-emerald-400">$ {stock.toLocaleString('es-AR')}</strong>
             </div>
             <div className="flex justify-between p-2 rounded-lg bg-indigo-950/20 border border-indigo-900/30">
                <span className="text-brand-300">15% Identidad y Packaging:</span> 
                <strong className="font-mono text-indigo-400">$ {packaging.toLocaleString('es-AR')}</strong>
             </div>
             <div className="flex justify-between p-2 rounded-lg bg-fuchsia-950/20 border border-fuchsia-900/30">
                <span className="text-brand-300">35% Tráfico y Pauta:</span> 
                <strong className="font-mono text-fuchsia-400">$ {ads.toLocaleString('es-AR')}</strong>
             </div>
             <p className="text-xs text-brand-500 italic mt-3 text-center">Permite adquirir apoximadamente {estimUnits} SKUs/Anillos promediando $3.000 de costo c/u.</p>
          </div>
        )}
      </form>
    </CalcBox>
  );
}

function CalcBuy3Pay2() {
  const [price, setPrice] = useState(15000);
  const [cost, setCost] = useState(5000);
  const [isCalculated, setIsCalculated] = useState(true);

  const regularProfit = (price - cost) * 3;
  const promoPrice = price * 2;
  const promoProfit = promoPrice - (cost * 3);

  const handleChange = (setter: any) => (e: any) => {
     setter(Number(e.target.value));
     setIsCalculated(false);
  };

  const calculate = (e: React.FormEvent) => {
     e.preventDefault();
     setIsCalculated(true);
  };

  return (
    <CalcBox 
      title="10. Simulador Peligro: Llevá 3, Pagá 2"
      description="Muchas marcas hacen promos 3x2 sin ver los costos. Este simulador te advierte si tu margen da para una oferta así o si terminarás regalando mercadería."
    >
      <form onSubmit={calculate} className="space-y-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
           <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Precio Und. ($)<Tooltip text="Precio de venta normal del producto estrella. Ej: $15.000 venta al público." /></label><input type="number" required value={price} onChange={handleChange(setPrice)} className="premium-input w-full p-2.5 text-sm" /></div>
           <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Costo Und ($)<Tooltip text="Costo que pagaste por unidad. Ej: $5.000 costo mayorista de la pieza." /></label><input type="number" required value={cost} onChange={handleChange(setCost)} className="premium-input w-full p-2.5 text-sm" /></div>
        </div>
        {!isCalculated ? (
          <button type="submit" className="golden-button w-full py-2.5 rounded-xl font-bold text-sm">Calcular Rentabilidad Promo</button>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="space-y-2 text-sm text-brand-300 bg-brand-950/50 p-3 rounded-xl border border-brand-800">
              <p className="flex justify-between">Ingreso Cesta Promoción: <span className="font-mono text-brand-400">$ {promoPrice.toLocaleString('es-AR')}</span></p>
              <p className="flex justify-between border-b border-brand-800/80 pb-2">Costo Total (3 items): <span className="font-mono text-red-500">$ {(cost * 3).toLocaleString('es-AR')}</span></p>
              <p className="flex justify-between font-bold pt-1">Ganancia Promoción: <span className="font-mono text-gold">$ {promoProfit.toLocaleString('es-AR')}</span></p>
              <p className="flex justify-between text-xs text-brand-500 mt-2 line-through">Ganancia Vta. Regular: <span className="font-mono">$ {regularProfit.toLocaleString('es-AR')}</span></p>
            </div>
            <ResultBadge 
              type={promoProfit > 0 ? (promoProfit > regularProfit * 0.4 ? 'warning' : 'danger') : 'danger'} 
              text={promoProfit <= 0 ? 'ROTUNDO NO. Estás destruyendo liquidez y perdiendo dinero.' : 'Cuidado. Licuaste demasiado el margen por volumen.'} 
            />
          </div>
        )}
      </form>
    </CalcBox>
  );
}

function CalcInventoryVelocity() {
   const [stockUnits, setStockUnits] = useState(500);
   const [salesPerMonth, setSalesPerMonth] = useState(150);
   const [isCalculated, setIsCalculated] = useState(true);

   const inventoryDays = salesPerMonth > 0 ? (stockUnits / (salesPerMonth / 30)) : 0;

   const handleChange = (setter: any) => (e: any) => {
      setter(Number(e.target.value));
      setIsCalculated(false);
   };

   const calculate = (e: React.FormEvent) => {
      e.preventDefault();
      setIsCalculated(true);
   };

   return (
      <CalcBox 
         title="11. Rendimiento de Stock (Días Inventario)"
         description="La 'velocidad' de tu negocio. Divide el stock total entre ventas. Te dirá cuántos días de caja estancada tienes. Ideal: Tener rotación alta sin quebrar inventario (20-40 días)."
      >
         <form onSubmit={calculate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
               <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Unidades en Stock<Tooltip text="Suma total de cantidad de productos que tienes guardados. Ej: 500 anillos y cadenas." /></label><input type="number" required value={stockUnits} onChange={handleChange(setStockUnits)} className="premium-input w-full p-2.5 text-sm" /></div>
               <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Ventas al Mes (Unid.)<Tooltip text="Cuántos productos despachas al mes. Ej: 150 unidades vendidas mensuales promedio." /></label><input type="number" required value={salesPerMonth} onChange={handleChange(setSalesPerMonth)} className="premium-input w-full p-2.5 text-sm" /></div>
            </div>
            {!isCalculated ? (
               <button type="submit" className="golden-button w-full py-2.5 rounded-xl font-bold text-sm">Calcular Rotación</button>
            ) : (
               <div className="animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-brand-800/50 rounded-2xl bg-brand-900/20">
                     <p className="text-xs uppercase tracking-widest text-brand-500 font-bold mb-2">Tienes inventario para</p>
                     <h4 className={`text-4xl font-mono font-bold ${inventoryDays > 90 ? 'text-amber-500' : (inventoryDays > 30 ? 'text-emerald-400' : 'text-red-500')}`}>{inventoryDays === 0 ? 'N/A' : Math.round(inventoryDays)} días</h4>
                  </div>
                  <ResultBadge 
                     type={inventoryDays > 90 ? 'warning' : (inventoryDays > 30 ? 'success' : 'danger')} 
                     text={inventoryDays > 90 ? 'Capital inmovilizado. Haz push con promos.' : inventoryDays < 30 ? 'Peligro inminente de quiebre de stock.' : 'Excelente rotación (recompras sanas).'} 
                  />
               </div>
            )}
         </form>
      </CalcBox>
   );
}

function CalcOnceVsChina() {
  const [onceCost, setOnceCost] = useState(4500); 
  const [chinaCostUSD, setChinaCostUSD] = useState(1.10);
  const [qty, setQty] = useState(300);
  const [isCalculated, setIsCalculated] = useState(true);

  const COEF_IMPORTACION = 2.2;
  const USD_MEP_ESTIMADO = 1250;
  
  const chinaFOB_ARS = chinaCostUSD * USD_MEP_ESTIMADO;
  const chinaFinal_ARS = chinaFOB_ARS * COEF_IMPORTACION;

  const totalOnce = onceCost * qty;
  const totalChina = chinaFinal_ARS * qty;
  const ahorro = totalOnce - totalChina;

  const handleChange = (setter: any) => (e: any) => {
     setter(Number(e.target.value));
     setIsCalculated(false);
  };

  const calculate = (e: React.FormEvent) => {
     e.preventDefault();
     setIsCalculated(true);
  };

  return (
    <CalcBox 
       title="12. Módulo Importador: Once vs China (FOB)"
       description="Si planeas escalar desde mayoristas locales (Once) a importar de Alibaba. Simula con cálculos de coeficiente aduanero y logístico (door-to-door) si el ahorro justifica los tiempos, aduana y volumen requerido."
    >
       <form onSubmit={calculate} className="space-y-4 flex flex-col h-full">
         <div className="grid grid-cols-3 gap-3 mb-4">
             <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Costo Once Arg ($)<Tooltip text="Costo por unidad de un revendedor local. Ej: $4500 comprando en Buenos Aires." /></label><input type="number" required value={onceCost} onChange={handleChange(setOnceCost)} className="premium-input w-full p-2.5 text-sm" /></div>
             <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Costo FOB China (U$D)<Tooltip text="Costo en origen sin flete, encontrado en Alibaba. Ej: $1.10 USD p/unidad FOB." /></label><input type="number" step="0.1" required value={chinaCostUSD} onChange={handleChange(setChinaCostUSD)} className="premium-input w-full p-2.5 text-sm" /></div>
             <div><label className="text-[11px] font-bold uppercase tracking-wider text-brand-500 flex items-center mb-1">Cant. Volumen (Unid.)<Tooltip text="Cantidad total del lote a comprar. Ej: 300 unidades mínimas del mismo SKU." /></label><input type="number" required value={qty} onChange={handleChange(setQty)} className="premium-input w-full p-2.5 text-sm" /></div>
         </div>
         {!isCalculated ? (
           <button type="submit" className="golden-button w-full py-2.5 rounded-xl font-bold text-sm mt-auto">Calcular Importación</button>
         ) : (
           <div className="animate-in fade-in zoom-in-95 duration-300 mt-auto">
             <div className="pt-3 pb-3 px-4 rounded-xl bg-brand-900/50 border border-brand-800">
               <p className="flex justify-between text-sm text-brand-400 mb-1">Costo Unid. Puesto ARG: <strong className="font-mono text-brand-100">$ {Math.round(chinaFinal_ARS).toLocaleString('es-AR')}</strong></p>
               <p className="text-[10px] text-brand-500 italic">Asumiendo Dólar $1250 y coeficiente logístico/aduanero 2.2x.</p>
             </div>
             <ResultBadge 
               type={ahorro > 0 ? 'success' : 'danger'} 
               text={ahorro > 0 ? `Si traes ${qty} unidades juntas desde China ahorras $ ${Math.round(ahorro).toLocaleString('es-AR')} comparado a Once.` : 'Usando Courier, te conviene abastecerte ágilmente en Once para esa cantidad.'} 
             />
           </div>
         )}
       </form>
    </CalcBox>
  );
}

