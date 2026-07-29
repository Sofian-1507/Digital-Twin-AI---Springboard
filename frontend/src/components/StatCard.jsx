function StatCard({
    title,
    value,
    subtitle,
    color
}) {

    return (

        <div
            className="stat-card"
            style={{ background: color }}
        >

            <h4>{title}</h4>

            <h2>{value}</h2>

            <p>{subtitle}</p>

        </div>

    );
}

export default StatCard;