import React from 'react'
import Card from '../component/card'
import Axios from '../config/network'
import Snackbar from '@material-ui/core/Snackbar'
import "@fortawesome/fontawesome-free/css/all.css"
import Snack from '../component/snackbar'
import './control.css'
import { connect } from 'react-redux'

class Control extends React.Component {
    constructor(props) {
        super(props)

        this.interval = null
        this.state = {
            variant: 'Error',
            message: ''
        }
    }

    componentDidMount = async () => {
        this.handleInterval()
    }

    handleInterval = async () => {
        this.interval = setInterval(() => {
            this.handleRefresh()
        }, 4000)
    }

    handleUpload = async (e) => {
        clearInterval(this.interval)
        this.interval = null

        console.log(e.target.files[0])

        const data = new FormData()

        data.append('file', e.target.files[0])
        data.append('name', 'some value user types')

        console.log('SENDING DATA')
        try {
            let response = await Axios.post('/upload', data)
            if (response.data) {
                this.props.onSnack()
                this.setState({ variant: 'Success' })
                this.setState({ message: response.data.message })
                this.handleInterval()
            }

        } catch (err) {
            if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
                this.props.onSnack()
                this.setState({ variant: 'Error' })
                this.setState({ message: 'Erro de conexão!!!' })
                this.handleInterval()
            }
            if (err.response && err.response.data) {
                console.log(err.response.data)
                this.props.onSnack()
                this.setState({ variant: 'Error' })
                this.setState({ message: err.response.data })
                this.handleInterval()
            }
        }
    }

    handleRefresh = async () => {
        try {
            let response = await Axios.post('/products/', {})
            console.log(response)
            if (response.data) {
                this.props.database(response.data)
            }
        } catch (err) {
            console.log(err)
            if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
                this.props.onSnack()
                this.setState({ variant: 'Error' })
                this.setState({ message: 'Erro de conexão!!!' })
            }
            if (err.response && err.response.data) {
                this.props.onSnack()
                this.setState({ variant: 'Error' })
                this.setState({ message: err.response.data })
            }
        }
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return

        this.props.offSnack()
    }

    render() {
        return (
            <div className="Before">
                {this.props.db.length === 0 ?
                    <div>
                        <label for="inputFile" style={{ cursor: "pointer" }}>
                            <i className="fas fa-circle-notch fa-spin fa-5x" />
                            <input id="inputFile"
                                type="file"
                                onChange={event => this.handleUpload(event)}
                                style={{ display: 'none' }}
                            />
                        </label>

                        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={this.props.open}
                            autoHideDuration={3000}
                            onClose={this.handleClose}
                        >
                            <Snack variant={this.state.variant} message={this.state.message} />
                        </Snackbar>
                    </div>
                    :
                    <div className="Main">
                        <div className="Header">
                            <div className="SubHeader-Main"></div>
                            <div className="SubHeader">
                                <h1>{'Controle de Estoque'}</h1>
                            </div>
                            <div className="SubHeader-Main">
                                <label for="inputFile" style={{ cursor: "pointer" }}>
                                    <i className="fas fa-cloud-upload-alt fa-2x" />
                                    <input id="inputFile"
                                        type="file"
                                        onChange={event => this.handleUpload(event)}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                        </div>

                        <h3>Atualização</h3>
                        {this.props.current ?
                            <Card
                                rfid={this.props.current.rfid}
                                info={this.props.current.description}
                                stock={this.props.current.stock} />
                            :
                            <></>
                        }
                        <h3>Banco de dados</h3>
                        <div className="Paper">
                            <div className="Paper-header">
                                <div className="Title-header">
                                    <h1 className="Text-header">RFID</h1>
                                </div>
                                <div className="Title-MainHeader">
                                    <h1 className="Text-header">DESCRIÇÃO</h1>
                                </div>
                                <div className="Title-header">
                                    <h1 className="Text-header">ESTOQUE</h1>
                                </div>
                            </div>
                            <hr className="Line" />
                            {this.props.db.map((item, index) =>
                                < Card
                                    key={`${index}`}
                                    rfid={item.rfid}
                                    info={item.description}
                                    stock={item.stock} />
                            )}
                        </div>
                        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={this.props.open}
                            autoHideDuration={3000}
                            onClose={this.handleClose}
                        >
                            <Snack variant={this.state.variant} message={this.state.message} />
                        </Snackbar>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    open: state.general.open,
    db: state.general.database,
    current: state.general.update
})

const mapDispatchToProps = dispatch => ({
    onSnack: () => dispatch({ type: 'ON_SNACK' }),
    offSnack: () => dispatch({ type: 'OFF_SNACK' }),
    database: (data) => dispatch({ type: 'ON_DATABASE', data: data })
})

export default connect(mapStateToProps, mapDispatchToProps)(Control)