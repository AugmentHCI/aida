import React from "react";
import { Table, Progress } from "antd";
import "./header.css";
import "./recommendationList.css";

function RecommendationList(props) {
  console.log("Recexlist: ", props.recEx);

  let recData = [];

  props.recEx.forEach((exercise) => {
    recData.push(exercise.listInfo);
  });

  const columns = [
    {
      title: "Oefening",
      dataIndex: "oefeninginfo",
      width: 200,
      align: "left",
      render: (text) => (
        <div>
          <div>
            <h3>Oefening {text.oefening}</h3>
          </div>
          <div>
            <p>{text.deel}</p>
          </div>
          <div>
            <p>{text.onderwerp}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Niveau oefening",
      dataIndex: "niveau",
      key: "niveau",
      width: 200,
      align: "left",
    },
  ];

  return (
    <div>
      <div className="rec-list">
        <div className="rec-expl-title rec-expl-title-border-left">
          <h1>Aanbevolen Reeks</h1>
        </div>
        <div className="reclist-container">
          <Table dataSource={recData} columns={columns} pagination={false} />
        </div>
      </div>
    </div>
  );
}

export default RecommendationList;
