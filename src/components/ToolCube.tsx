import type {ToolLogoMap} from './ToolLogos';

export interface CubeTool {
  name: string;
  logo: string;
  index: number;
}

export function ToolCube({name, logo, index}: CubeTool) {
  return (
    <div className="tool-cube" style={{'--i': index}} tabindex="0" aria-label={name}>
      <div className="cube-face cube-front">
        <div className="cube-logo" dangerouslySetInnerHTML={{__html: logo}} />
      </div>
      <div className="cube-face cube-right">{name.toUpperCase()}</div>
      <div className="cube-face cube-left" />
      <div className="cube-face cube-top" />
      <div className="cube-face cube-bottom" />
    </div>
  );
}

export function ToolkitGroup({label, items}: {label: string; items: CubeTool[]}) {
  return (
    <div className="tool-group">
      <h3 className="tool-group-label">{label}</h3>
      <div className="cube-row">
        {items.map((item) => (
          <ToolCube key={item.name} {...item} />
        ))}
      </div>
    </div>
  );
}