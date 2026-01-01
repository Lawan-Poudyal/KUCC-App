const Navbar = () => {
    return (
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>

            {/* COMMENT: Optional admin avatar image */}
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        </header>
    );
};

export default Navbar;