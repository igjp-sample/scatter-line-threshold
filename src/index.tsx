import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { IgrLegendModule, IgrNumberAbbreviatorModule, IgrDataChartCoreModule,
    IgrDataChartScatterModule, IgrDataChartScatterCoreModule, IgrDataChartInteractivityModule,
     IgrDataChartAnnotationModule } from 'igniteui-react-charts';
import { IgrLegend, IgrDataChart, IgrNumericXAxis, IgrNumericYAxis,
    IgrScatterLineSeries, IgrDataToolTipLayer, IgrValueOverlay } from 'igniteui-react-charts';

const mods: any[] = [
    IgrLegendModule,
    IgrNumberAbbreviatorModule,
    IgrDataChartCoreModule,
    IgrDataChartScatterModule,
    IgrDataChartScatterCoreModule,
    IgrDataChartInteractivityModule,
    IgrDataChartAnnotationModule
];
mods.forEach((m) => m.register());

export default class Sample extends React.Component<any, any> {
    private legend: IgrLegend
    private legendRef(r: IgrLegend) {
        this.legend = r;
        this.setState({});
    }
    private chart: IgrDataChart
    private chartRef(r: IgrDataChart) {
        this.chart = r;
        this.setState({});
    }

    constructor(props: any) {
        super(props);

        this.legendRef = this.legendRef.bind(this);
        this.chartRef = this.chartRef.bind(this);

        this.actualDataSource = this.getActualData();

        this.onThresholdValueChange = this.onThresholdValueChange.bind(this);
        this.state = {
            thresholdValue: 30,
            thresholdData: this.getThresholdData(30),
        }
    }

    public actualDataSource: any[] = null;

    public getActualData() : any[] {
        var data: any[] = [];

        data.push( { x: 0, y: 50 } );
        data.push( { x: 1, y: 20 } );
        data.push( { x: 2, y: 40 } );
        data.push( { x: 3, y: 20 } );
        data.push( { x: 4, y: 60 } );
        data.push( { x: 5, y: 20 } );
        data.push( { x: 6, y: 60 } );

        return data;
    }

    public getThresholdData(thresholdValue : number) : any[] {
        var data: any[] = [];

        for (let i = 0; i < this.actualDataSource.length; i++) {
            var curr = this.actualDataSource[i];

            if (curr.y >= thresholdValue) {
                data.push( curr );
            } else {
                data.push( { x: Number.NaN, y: Number.NaN } );
            }

            var next = null;
            if (i < this.actualDataSource.length - 1) {
                next = this.actualDataSource[i+1];
            }
            if (next == null) {
                continue;
            }

            if ((curr.y <  thresholdValue && next.y > thresholdValue) ||
                (curr.y >= thresholdValue && next.y < thresholdValue)) {
                var dx = curr.x - next.x;
                var dy = curr.y - next.y;
                var m = dy / dx;
                var b = curr.y - (curr.x * m);
                var y = thresholdValue;
                var x = (y - b) / m;
                data.push( { x: x, y: y } );
            }

        }

        return data;
    }

    public onThresholdValueChange(e: any) {
        var value = e.target.value
        this.setState({
            thresholdValue: value,
            thresholdData: this.getThresholdData(value)
        });
    }

    public render(): JSX.Element {
        return (
        <div className="container sample">

            <div className="legend options horizontal">
                <IgrLegend
                    ref={this.legendRef}
                    orientation="Horizontal">
                </IgrLegend>

                <div className="options horizontal">
                    {/* <label className="option-label">Threshold Value: </label> */}
                    <label className="options-value">{this.state.thresholdValue}</label>
                    <input className="options-slider" type="range" min={0} max={80} step={1} value={this.state.thresholdValue}
                           onChange={this.onThresholdValueChange}/>
                </div>
            </div>

            <div className="container fill">
                <IgrDataChart
                    ref={this.chartRef}
                    legend={this.legend}>
                    <IgrNumericXAxis
                        name="xAxis" >
                    </IgrNumericXAxis>
                    <IgrNumericYAxis
                        name="yAxis" minimumValue={0} maximumValue={80} interval={10}
                        abbreviateLargeNumbers="true" >
                    </IgrNumericYAxis>
                    <IgrScatterLineSeries
                        name="ScatterLineSeries1"
                        title="Actual Data"
                        xAxisName="xAxis"
                        yAxisName="yAxis"
                        xMemberPath="x"
                        yMemberPath="y"
                        dataSource={this.actualDataSource}
                        thickness={8} opacity={0.95}
                        markerType="Circle" brush="green"
                        showDefaultTooltip="true">
                    </IgrScatterLineSeries>

                    <IgrScatterLineSeries
                        name="ScatterLineSeries2"
                        title="Threshold Data"
                        xAxisName="xAxis"
                        yAxisName="yAxis"
                        xMemberPath="x"
                        yMemberPath="y"
                        dataSource={this.state.thresholdData}
                        thickness={8} opacity={0.75}
                        markerType="Circle"  brush="red"
                        showDefaultTooltip="true">
                    </IgrScatterLineSeries>

                    <IgrValueOverlay
                        title="Threshold Value"
                        name="ValueOverlay" value={this.state.thresholdValue}
                        axisName="yAxis" brush="dodgerblue" thickness={2} opacity={0.75}>
                    </IgrValueOverlay>

                    <IgrDataToolTipLayer
                        name="DataToolTipLayer" groupingMode="Individual" >
                    </IgrDataToolTipLayer>
                </IgrDataChart>
            </div>
        </div>
        );
    }

}

// rendering above component in the React DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Sample/>);