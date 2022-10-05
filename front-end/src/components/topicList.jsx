import React, { Component } from "react";
import "./topicList.css";
import { Table, Progress } from "antd";
import { useState, useEffect, useRef } from "react";
import { render } from "@testing-library/react";

class TopicList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectionType: [],
    };
  }

  render() {
    let selectedRowsTable = [];

    const columns = [
      {
        title: "Voortgang",
        dataIndex: "voortgang",
        width: 200,
        align: "left",
        render: (text) => (
          <div style={{ width: 100 }}>
            <Progress percent={text} />
          </div>
        ),
      },
      {
        title: "Niveau",
        dataIndex: "niveau",
        key: "niveau",
        width: 200,
        align: "left",
      },
      {
        title: "Onderwerp",
        dataIndex: "onderwerp",
        key: "onderwerp",
        color: "red",
        width: 800,
        align: "left",
      },
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows,
          "rowslection ",
          rowSelection
        );
        this.props.onGetSelectedRows(this.props.id, selectedRows);
      },
    };

    return (
      <div className="container">
        <div className="deel">
          <h1>{this.props.chapter}</h1>
        </div>
        <Table
          rowSelection={{
            type: this.selectionType,
            ...rowSelection,
          }}
          dataSource={this.props.topics}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}

export default TopicList;
