const Card = ({ title, icon: Icon, amount, iconBg, iconColor }) => {
  return (
    <div className="flex flex-col gap-4 bg-surface shadow-2xl p-4 rounded-2xl">
      <div className="flex items-center justify-between ">
        <h2 className="text-text-secondary">{title}</h2>
        <div className={`${iconBg} px-2 py-2 rounded-xl`}>
          <Icon className={iconColor} size={20} />
        </div>
      </div>
      <div>
        <p className="text-text-primary text-3xl font-bold">
          {"₹"}
          {amount}
        </p>
      </div>
    </div>
  );
};

export default Card;
