import { useState, useMemo, useCallback, memo } from 'react';

const ItemList = memo(function ItemList({ items, onSelect }: { items: number[]; onSelect: (n: number) => void }) {
    console.log('ItemList rendered');
    return (
        <ul>
            {items.map((n) => (
                <li key={n} onClick={() => onSelect(n)} style={{ cursor: 'pointer' }}>{n}</li>
            ))}
        </ul>
    );
});

export function UseMemoVsUseCallback() {
    const [numbers, setNumbers] = useState([1, 2, 3, 4, 5]);
    const [selected, setSelected] = useState<number | null>(null);
    const [darkMode, setDarkMode] = useState(false);

    // useMemo — memoizes a COMPUTED VALUE, recalculates only when `numbers` changes
    const sum = useMemo(() => {
        console.log('useMemo: computing sum');
        return numbers.reduce((acc, n) => acc + n, 0);
    }, [numbers]);

    // useCallback — memoizes a FUNCTION REFERENCE, same reference across renders
    // Without this, ItemList re-renders on every parent render (e.g. darkMode toggle)
    const handleSelect = useCallback((n: number) => {
        console.log('useCallback: handleSelect called');
        setSelected(n);
    }, []);

    return (
        <div style={{ background: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#000', padding: 16, borderRadius: 8 }}>
            <button onClick={() => setDarkMode((d) => !d)}>Toggle dark mode (re-renders without changing data)</button>
            <button onClick={() => setNumbers((ns) => [...ns, ns.length + 1])} style={{ marginLeft: 8 }}>Add number (changes deps)</button>

            <p>
                <strong>useMemo</strong> — sum: {sum}<br />
                <small>Check console: "computing sum" only logs when numbers change, not on dark mode toggle.</small>
            </p>

            <p>
                <strong>useCallback</strong> — selected: {selected ?? 'none'}<br />
                <small>Check console: "ItemList rendered" only logs when numbers change, not on dark mode toggle.</small>
            </p>

            <ItemList items={numbers} onSelect={handleSelect} />
        </div>
    );
}
