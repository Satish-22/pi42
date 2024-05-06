import React, { useState } from 'react';

const WebSocketExample: React.FC = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const connectWebSocket = () => {
        const socketURL = "wss://fawss.pi42.com/socket.io/?EIO=4&transport=websocket";
        const newSocket = new WebSocket(socketURL);

        newSocket.onopen = () => {
            console.log('WebSocket connection established.');
            newSocket.send("40");
        };

        newSocket.onmessage = (event) => {
            console.log('Message from server:', event.data);
            const rawData = JSON.parse(event.data.substring(event.data.indexOf('["allContractDetails"')));
            updateTable(rawData);
        };

        newSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        newSocket.onclose = () => {
            console.log('WebSocket connection closed.');
        };

        setSocket(newSocket);
    };

    const updateTable = (data: any[]) => {
        const table = document.getElementById("resultTable") as HTMLTableElement;

        data.forEach((symbolData) => {
            for (const symbolName in symbolData) {
                if (symbolData.hasOwnProperty(symbolName)) {
                    const rowData = symbolData[symbolName];
                    if (rowData.lastPrice !== undefined ||
                        rowData.marketPrice !== undefined ||
                        rowData.priceChangePercent !== undefined ||
                        rowData.baseAssetVolume !== undefined) {
                        const existingRow = document.querySelector(`#resultTable tr[data-symbol="${symbolName}"]`);
                        if (existingRow) {
                            existingRow.cells[1].innerHTML = rowData.lastPrice !== undefined ? rowData.lastPrice : '';
                            existingRow.cells[2].innerHTML = rowData.marketPrice !== undefined ? rowData.marketPrice : '';
                            existingRow.cells[3].innerHTML = rowData.priceChangePercent !== undefined ? rowData.priceChangePercent : '';
                            existingRow.cells[4].innerHTML = rowData.baseAssetVolume !== undefined ? rowData.baseAssetVolume : '';
                        } else {
                            const newRow = table.insertRow();
                            newRow.setAttribute('data-symbol', symbolName);
                            newRow.insertCell(0).innerHTML = symbolName;
                            newRow.insertCell(1).innerHTML = rowData.lastPrice !== undefined ? rowData.lastPrice : '';
                            newRow.insertCell(2).innerHTML = rowData.marketPrice !== undefined ? rowData.marketPrice : '';
                            newRow.insertCell(3).innerHTML = rowData.priceChangePercent !== undefined ? rowData.priceChangePercent : '';
                            newRow.insertCell(4).innerHTML = rowData.baseAssetVolume !== undefined ? rowData.baseAssetVolume : '';
                        }
                    }
                }
            }
        });
    };

    return (
        <div>
            <h1>WebSocket Example</h1>
            <button onClick={connectWebSocket}>Connect WebSocket</button>
            <table id="resultTable" border={1}>
                <thead>
                    <tr>
                        <th>Symbol Name</th>
                        <th>Last Price</th>
                        <th>Market Price</th>
                        <th>Price Change Percent</th>
                        <th>Base Asset Volume</th>
                    </tr>
                </thead>
                <tbody>
                    {}
                </tbody>
            </table>
        </div>
    );
};

export default WebSocketExample;
