function IconSvg({ iconClass, fontSize = 20, color }) {
  const customStyle = {
    fontSize: `${fontSize}px`
  };
  if (color) {
    customStyle.color = color;
  }
  return (
    <svg className="icon" aria-hidden="true" style={customStyle}>
      <use xlinkHref={`#${iconClass}`}></use>
    </svg>
  );
}

export default IconSvg;
