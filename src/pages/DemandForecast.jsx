import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  CircleAlert,
  Clock,
  Cpu,
  Database,
  LineChart,
} from 'lucide-react';
import { getDemandPredictionOptions, requestDemandPrediction } from '../services/predictionService';

const evaluationResults = [
  { label: 'MAE', value: '6.89' },
  { label: 'RMSE', value: '9.56' },
  { label: 'R² Score', value: '81.55%' },
];

const processSteps = [
  'Dataset',
  'Data Cleaning',
  'Prepare 10 Model Features',
  'Train/Test + One-Hot Encoding',
  'Random Forest',
  'Model Evaluation',
  'Python ML Service',
  'Result in React',
];

export const DemandForecast = () => {
  const [options, setOptions] = useState({ products: [], stores: [] });
  const [optionsState, setOptionsState] = useState('loading');
  const [productId, setProductId] = useState('');
  const [storeId, setStoreId] = useState('');
  const [horizon, setHorizon] = useState('7');
  const [requestState, setRequestState] = useState('idle');
  const [serviceMessage, setServiceMessage] = useState('');
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    getDemandPredictionOptions()
      .then((availableOptions) => {
        if (!isCurrent) return;
        setOptions(availableOptions);
        setProductId(availableOptions.products[0]?.id || '');
        setStoreId(availableOptions.stores[0]?.id || '');
        setOptionsState('ready');
      })
      .catch((error) => {
        if (!isCurrent) return;
        setServiceMessage(error.message);
        setOptionsState('unavailable');
      });

    return () => { isCurrent = false; };
  }, []);

  const selectedProduct = options.products.find((product) => product.id === productId);
  const selectedStore = options.stores.find((store) => store.id === storeId);

  const clearPreviousResult = () => {
    setPrediction(null);
    setRequestState('idle');
    setServiceMessage('');
  };

  const handlePredictionRequest = async (event) => {
    event.preventDefault();
    if (!selectedProduct || !selectedStore) return;

    setRequestState('loading');
    setPrediction(null);
    setServiceMessage('');
    try {
      const result = await requestDemandPrediction({
        productId,
        storeId,
        horizonDays: Number(horizon),
      });
      setPrediction(result);
      setRequestState('success');
    } catch (error) {
      setServiceMessage(error.message);
      setRequestState('unavailable');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in py-4">
      <section className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-8 md:p-10 rounded-3xl border border-indigo-500/30 text-white shadow-2xl relative overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            Local Python model · review demonstration
          </div>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-600/30 border border-indigo-400/30 text-indigo-300 shadow-xl shadow-indigo-500/20 my-2">
            <BrainCircuit className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Demand Forecasting</h1>
          <p className="text-sm md:text-base text-indigo-200 font-medium leading-relaxed">
            Send product and store selections to the Random Forest model trained from the project dataset.
          </p>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            The Python service trains the notebook-compatible pipeline at startup. The result shown below comes from that model when the service is running.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <form onSubmit={handlePredictionRequest} className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h2 className="font-bold text-slate-800">Prepare a prediction request</h2>
            <p className="text-xs text-slate-500 mt-1">Choose a product, store, and horizon from the dataset.</p>
          </div>

          <label className="block text-xs font-semibold text-slate-600">
            Product
            <select
              value={productId}
              onChange={(event) => { setProductId(event.target.value); clearPreviousResult(); }}
              disabled={optionsState !== 'ready'}
              required
              className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 disabled:opacity-60"
            >
              {options.products.map((product) => (
                <option key={product.id} value={product.id}>{product.name} · {product.category}</option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-semibold text-slate-600">
            Store
            <select
              value={storeId}
              onChange={(event) => { setStoreId(event.target.value); clearPreviousResult(); }}
              disabled={optionsState !== 'ready'}
              required
              className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 disabled:opacity-60"
            >
              {options.stores.map((store) => (
                <option key={store.id} value={store.id}>{store.id} · {store.city}</option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-semibold text-slate-600">
            Forecast horizon
            <select
              value={horizon}
              onChange={(event) => { setHorizon(event.target.value); clearPreviousResult(); }}
              className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
            >
              <option value="7">Next 7 days</option>
              <option value="14">Next 14 days</option>
              <option value="30">Next 30 days</option>
            </select>
          </label>

          {selectedProduct && selectedStore && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
              Model inputs use the latest matching product/store row in <span className="font-bold">retail_demand_2025.csv</span>.
            </div>
          )}

          <button
            type="submit"
            disabled={optionsState !== 'ready' || !selectedProduct || !selectedStore || requestState === 'loading'}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {requestState === 'loading' ? 'Running model…' : 'Predict Demand'}
            <ArrowRight className="w-4 h-4" />
          </button>
          {optionsState === 'loading' && <p role="status" className="text-xs text-slate-500">Connecting to the local Python model…</p>}
        </form>

        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm" aria-live="polite">
          <div className="flex items-center gap-2 mb-3">
            <LineChart className="w-4 h-4 text-indigo-600" />
            <h2 className="font-bold text-slate-800">Prediction result</h2>
          </div>
          {prediction ? (
            <div className="min-h-36 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
              <p className="text-xs text-emerald-800 font-semibold">Random Forest output · based on {prediction.basedOnDate}</p>
              <p className="text-sm text-slate-700 mt-3">Estimated daily demand</p>
              <p className="text-2xl text-emerald-900 font-black">{prediction.estimatedDailyUnits} units/day</p>
              <p className="text-sm text-slate-700 mt-3">{prediction.horizonDays}-day projected total</p>
              <p className="text-xl text-emerald-900 font-black">{prediction.estimatedHorizonUnits} units</p>
              <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">{prediction.projectionAssumption}</p>
            </div>
          ) : (
            <div className={`min-h-36 rounded-xl border border-dashed p-4 flex flex-col justify-center ${requestState === 'unavailable' ? 'border-rose-300 bg-rose-50/70' : 'border-slate-300 bg-slate-50'}`}>
              <div className={`flex items-center gap-2 font-bold text-sm ${requestState === 'unavailable' ? 'text-rose-800' : 'text-slate-700'}`}>
                <CircleAlert className="w-4 h-4 shrink-0" />
                {requestState === 'unavailable' ? 'ML service unavailable' : 'No prediction requested yet'}
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {requestState === 'unavailable'
                  ? serviceMessage
                  : 'Start the local Python service and request a forecast. The page will not show placeholder numbers.'}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Current model information</h2>
            <p className="text-xs text-slate-500 mt-1">Existing notebook experiment; these are not production or live-service metrics.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-[11px] uppercase tracking-wide text-slate-400 font-bold">Model</p>
            <p className="text-sm text-slate-800 font-bold mt-1">Random Forest Regressor</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-[11px] uppercase tracking-wide text-slate-400 font-bold">Target</p>
            <p className="text-sm text-slate-800 font-bold mt-1">Units Sold (`Units_Sold`)</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400 font-bold">Dataset</p>
            <p className="text-sm text-slate-800 font-bold mt-1">retail_demand_2025.csv</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-bold text-slate-700 mb-2">Existing experimental evaluation results</p>
          <div className="grid grid-cols-3 gap-3">
            {evaluationResults.map((metric) => (
              <div key={metric.label} className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-center">
                <p className="text-[11px] uppercase tracking-wide text-indigo-500 font-bold">{metric.label}</p>
                <p className="text-lg text-indigo-950 font-black mt-1">{metric.value}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">These values are recorded in the existing notebook evaluation; no new performance claim is made here.</p>
        </div>
      </section>

      <section className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-sky-600" />
          <div>
            <h2 className="font-bold text-slate-800">How the demand prediction work flows</h2>
            <p className="text-xs text-slate-500 mt-1">The model runs in the local Python service and returns its result to this page.</p>
          </div>
        </div>
        <ol className="flex flex-wrap items-center gap-2">
          {processSteps.map((step, index) => (
            <React.Fragment key={step}>
              <li className={`px-3 py-2 rounded-lg text-xs font-semibold ${index < 6 ? 'bg-sky-50 text-sky-800 border border-sky-100' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'}`}>
                {step}
              </li>
              {index < processSteps.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />}
            </React.Fragment>
          ))}
        </ol>
        <div className="mt-4 p-3 rounded-xl bg-slate-50 text-xs text-slate-600 leading-relaxed">
          The service reproduces the notebook's evaluated 10-feature model: product, store, price, discount, promotion, holiday, and stock fields. The notebook also explores date and lag features separately. The model predicts a daily demand value; the horizon total multiplies it by the selected days and assumes the daily rate stays constant. The dataset ends in 2025, so this is a dataset-backed review demonstration, not a current operational forecast.
        </div>
        <div className={`mt-3 flex items-center gap-1.5 text-[11px] font-semibold ${optionsState === 'ready' ? 'text-emerald-700' : 'text-amber-700'}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          {optionsState === 'ready' ? 'Python model service connected' : 'Python model service not connected'}
        </div>
      </section>
    </div>
  );
};

