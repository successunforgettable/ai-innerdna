// StateSlider.tsx
interface StateSliderProps {
  value: number;
  onChange: (value: number) => void;
  colors: [string, string];
  stateNames: [string, string];
}

const StateSlider = ({ value, onChange, colors, stateNames }: StateSliderProps) => (
  <div 
    className="state-slider"
    style={{
      '--primary-color': colors[0],
      '--secondary-color': colors[1]
    } as React.CSSProperties}
  >
    <div className="state-slider-header">
      <span 
        className="state-label" 
        style={{ '--state-color': colors[0], color: colors[0] } as React.CSSProperties}
      >
        {stateNames[0]}
      </span>
      <span 
        className="state-label" 
        style={{ '--state-color': colors[1], color: colors[1] } as React.CSSProperties}
      >
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
    />
    
    <div className="percentage-display">
      <span 
        className="percentage-value" 
        style={{ color: colors[0], borderColor: colors[0] }}
      >
        {100 - value}%
      </span>
      <span 
        className="percentage-value" 
        style={{ color: colors[1], borderColor: colors[1] }}
      >
        {value}%
      </span>
    </div>
  </div>
);

export default StateSlider;