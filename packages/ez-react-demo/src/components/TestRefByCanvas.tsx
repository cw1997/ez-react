import React, {Ref} from 'ez-react';

//import "./TestRef.sass"


interface IProps {
  x: number
  y: number
  w: number
  h: number
}
interface IState {

}

export default class TestRefByCanvas extends React.Component<IProps, IState> {
  private readonly canvasRef: Ref;
  constructor(props: IProps) {
    super(props);
    this.canvasRef = React.createRef();
  }
  componentDidMount() {
    const {x, y, w, h} = this.props;
    console.log(`canvas componentDidMount, draw rect start`);
    const canvasContext = (this.canvasRef.current as HTMLCanvasElement).getContext('2d');
    canvasContext.fillRect(x, y, w, h);
    canvasContext.stroke();
    console.log(`canvas draw rect complete !`);
  }
  render() {
    return (
      <div className="TestRefByCanvas">
        <h1>TestRefByCanvas</h1>
        <div>
          <p>
            The size of the canvas below is 100*100,
            then you can use ref to get the canvas DOM instance, then call the HTML5 Canvas API to draw any shape.
          </p>
          <p>
            For example, a size of rect is 50 * 50 is drawn at (50, 50) in the life-cycle function componentDidMount()
          </p>
        </div>
        <canvas id="my-canvas" width="100" height="100" style={{border: '1px solid black'}} ref={this.canvasRef}/>
      </div>
    )
  }

}
