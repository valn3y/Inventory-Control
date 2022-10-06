import React from 'react'
import './card.css'

export default class Card extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="Card">
                <div className="Card-infos">
                    <p>{this.props.rfid}</p>
                </div>
                <div className="Card-MainInfos">
                    <p>{this.props.info}</p>
                </div>
                <div className="Card-infos">
                    <p>{this.props.stock}</p>
                </div>
            </div>
        )
    }
}