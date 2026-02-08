import { useMemo } from "react";

const BarChart = ({ data }) => {
  const maxTicketCount = useMemo(() => {
    return Math.max(...data.map((item) => item.ticketCount));
  }, data);
  return (
    <div className="chart-container">
      <div className="chart">
        {data.map((item, index) => {
          return (
            <div
              className="bar"
              key={item.id}
              style={{
                background: item.colour,
                height: `${(item.ticketCount / maxTicketCount) * 100}%`,
              }}
            ></div>
          );
        })}
      </div>
      <div className="yaxis-label">Number of Tickets</div>
      <div className="xaxis-label">Departments</div>
    </div>
  );
};

export default BarChart;
