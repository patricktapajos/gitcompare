import React, { Component } from "react";
import moment from "moment";
import logo from "../../assets/logo.png";
import { Container, Form } from "./styles";
import CompareList from "../../components/CompareList/index";
import api from "../../services/api";

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            repositoryError: false,
            repositoryInput: "",
            repositories: []
        };
    }

    handleAddRepository = async e => {
        e.preventDefault();
        this.setState({ loading: true });
        try {
            const { data: repository } = await api.get(
                `repos/${this.state.repositoryInput}`
            );
            repository.lastCommit = moment(repository.pushed_at).fromNow();

            this.setState({
                repositoryError: false,
                repositoryInput: "",
                repositories: [...this.state.repositories, repository]
            });
        } catch (err) {
            this.setState({
                repositoryError: true
            });
            console.log(err);
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        return (
            <Container>
                <img src={logo} alt="Github Compare" />
                <Form
                    withError={this.state.repositoryError}
                    onSubmit={this.handleAddRepository}
                >
                    <input
                        value={this.state.repositoryInput}
                        type="text"
                        placeholder="usuário/repositório"
                        onChange={e =>
                            this.setState({ repositoryInput: e.target.value })
                        }
                    />
                    <button type="submit">
                        {this.state.loading ? (
                            <i className="fa fa-spinner fa-pulse" />
                        ) : (
                            "OK"
                        )}
                    </button>
                </Form>

                <CompareList repositories={this.state.repositories} />
            </Container>
        );
    }
}
