export default function PulseLine() {
  const segment = "M0,14 L40,14 L52,14 L58,2 L66,26 L74,14 L100,14";
  return (
    <div className="pulse-line" aria-hidden="true">
      <svg viewBox="0 0 100 28" preserveAspectRatio="none">
        <path
          d={`${segment} L${100 + 0},14 ` + segment.replace(/(\d+(\.\d+)?)/g, (n) => Number(n) + 100)}
          fill="none"
          stroke="#2f6f62"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
