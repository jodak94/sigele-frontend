import { useState, useReducer } from 'react';

type CounterState = { count: number; step: number };
type CounterAction =
    | { type: 'increment' }
    | { type: 'decrement' }
    | { type: 'set_step'; payload: number }
    | { type: 'reset' };

const counterInitial: CounterState = { count: 0, step: 1 };

function counterReducer(state: CounterState, action: CounterAction): CounterState {
    switch (action.type) {
        case 'increment': return { ...state, count: state.count + state.step };
        case 'decrement': return { ...state, count: state.count - state.step };
        case 'set_step':  return { ...state, step: action.payload };
        case 'reset':     return counterInitial;
        default:          return state;
    }
}

export function UseStateVsUseReducer() {
    const [count, setCount] = useState(0);
    const [step, setStep] = useState(1);
    const [state, dispatch] = useReducer(counterReducer, counterInitial);

    return (
        <div style={{ display: 'flex', gap: 32 }}>

            <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
                <h3>useState</h3>
                <p>Count: {count}</p>
                <label>Step: <input type="number" value={step} onChange={(e) => setStep(Number(e.target.value))} /></label>
                <br />
                <button onClick={() => setCount((c) => c + step)}>+</button>
                <button onClick={() => setCount((c) => c - step)}>−</button>
                <button onClick={() => { setCount(0); setStep(1); }}>Reset</button>
                {/* Reset requires two separate setters */}
            </div>

            <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
                <h3>useReducer</h3>
                <p>Count: {state.count}</p>
                <label>Step: <input type="number" value={state.step} onChange={(e) => dispatch({ type: 'set_step', payload: Number(e.target.value) })} /></label>
                <br />
                <button onClick={() => dispatch({ type: 'increment' })}>+</button>
                <button onClick={() => dispatch({ type: 'decrement' })}>−</button>
                <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
                {/* Reset is one dispatch — both fields reset atomically */}
            </div>

        </div>
    );
}
