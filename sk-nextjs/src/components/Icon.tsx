export default function Icon({ name, className = '', style }: { name: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={`icon ${className}`} style={style} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}
