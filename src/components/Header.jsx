
const Header = ({ title, imgSrc, alt, ...props }) => {
  return (
    <div {...props}>
      <img src={imgSrc} alt={alt}/>
      <h1>{title}</h1>
    </div>
  );
};

export default Header;
