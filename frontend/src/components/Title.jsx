const Title = ({ title, subTitle, align }) => {
  return (
    <div className={`flex flex-col justify-center ${align === "left" ? "items-center md:items-start md:text-left" : "items-center text-center"}`}>
      <h2 className={`text-3xl md:text-4xl font-bold text-gray-800 ${align === "left" ? "" : ""}`}>{title}</h2>
      {subTitle && <p className="text-sm md:text-base text-gray-500 mt-3 max-w-2xl">{subTitle}</p>}
    </div>
  );
};

export default Title;
