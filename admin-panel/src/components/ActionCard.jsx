const ActionCard = ({ title, subtitle }) => {
    return (
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-md cursor-pointer">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
    );
};

export default ActionCard;

