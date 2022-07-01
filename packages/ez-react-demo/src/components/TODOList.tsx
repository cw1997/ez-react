import React from '@cw1997/ez-react';

//import "./TODOList.sass"

interface IItem {
  id: number
  name: string
}

interface IPropsTODOList {

}
interface IStateTODOList {
  addInput: string
  nextId: number
  list: IItem[]
}

export default class TODOList extends React.Component<IPropsTODOList, IStateTODOList>{
  constructor(props) {
    super(props)
    this.state = {
      addInput: '',
      nextId: 4,
      list: [
        {id: 1, name: 'todo 1'},
        {id: 2, name: 'todo 2'},
        {id: 3, name: 'todo 3'},
      ]
    }
  }
  onChange(e) {
    this.setState({addInput: e.target.value})
  }
  handleAdd() {
    const {addInput, nextId, list} = this.state
    list.push({id: nextId, name: addInput})
    this.setState({list, nextId: nextId+1})
  }
  handleDelete(index: number) {
    const list = this.state.list.filter((v, k) => k !== index)
    this.setState({list})
  }
  render() {
    return (
      <div className="TODOList">
        <div className="TODOList-toolbar">
          <button onClick={this.handleAdd}>Add</button>
          <input onChange={this.onChange}/>
        </div>
        <ul className="TODOList-list">
          {this.state.list.map((v, k) => (
            <li key={v.id}>{v.id} - {v.name} <button onClick={(e) => this.handleDelete(k)}>Delete</button></li>
          ))}
        </ul>
      </div>
    )
  }
}
