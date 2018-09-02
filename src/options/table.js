import React, { Component } from 'react'
import ReactTable from "react-table"
import "react-table/react-table.css"
import JsonBin from '../jsonbin'

let jsonbin = new JsonBin()
export default class Table extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        jsonbin.getData(0, data => {
            this.setState({
                data: data.data
            })
        })
    }

    render() {
        const { data } = this.state;
        return (
            <div>
                <h2> Watched Lectures: </h2> 
                <ReactTable
                    data={data}
                    columns={[
                    {
                        Header: "Title",
                        accessor: "title",
                        Cell: row => (
                            <div>
                                <a href={row.original.url} target="_blank">
                                    {row.value}
                                </a>
                            </div>
                        )
                    },
                    {
                        Header: "Date",
                        accessor: "date",
                        Cell: row => (
                            <div>
                                { new Date(row.value).toLocaleString() }
                            </div>
                        )
                    },
                    {
                        Header: "Duration (sec)",
                        accessor: "duration"
                    }
                    ]}
                    defaultPageSize={25}
                    className="-striped -highlight"
                    defaultSorted={[
                        {
                        id: "date",
                        desc: false
                        }
                    ]}
                />
                <br />
            </div>
          );
    }
}