// StateSlider.tsx
interface StateSliderProps {
  value: number;
  onChange: (value: number) => void;
  colors: [string, string];
  stateNames: [string, string];
}

const StateSlider = ({ value, onChange, colors, stateNames }: StateSliderProps) => (
  <div className="state-slider">
    <div className="state-slider-header">
      <span className="state-label" style={{ color: colors[0] }}>
        {stateNames[0]}
      </span>
      <span className="state-label" style={{ color: colors[1] }}>
        {stateNames[1]}
      </span>
    </div>
    
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="slider"
      style={{
        background: `linear-gradient(to right, ${colors[0]}, ${colors[1]})`
      }}
    />
    
    <div className="percentage-display">
      <span style={{ color: colors[0] }}>{value}%</span>
      <span style={{ color: colors[1] }}>{100 - value}%</span>
    </div>
  </div>
);

export default StateSlider;