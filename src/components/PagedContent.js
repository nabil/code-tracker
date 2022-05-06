import React from "react";
import {
    Grid,
    List,
    Pagination,
    Select,
} from 'semantic-ui-react';

const pageSizeOptions = [
    { key: 10, value: 10, text: 10 },
    { key: 20, value: 20, text: 20 },
    { key: 50, value: 50, text: 50 },
];

const START_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export default class PagedContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contentId: props.contentId,
            elements: props.elements,
            pageSize: DEFAULT_PAGE_SIZE,
            totalPages: Math.ceil(props.elements.length / DEFAULT_PAGE_SIZE),
            currentPage: START_PAGE,
        };

        this.handlePaginationChange = this.handlePaginationChange.bind(this);
    }

    handlePaginationChange = (e, { activePage }) => {
        this.setState({ currentPage: activePage });
    };

    setPageSize = (e) => {
        var newPageSize = parseInt(e.target.innerText);
        this.setState({
            pageSize: newPageSize,
            currentPage: START_PAGE,
            totalPages: Math.ceil(this.state.elements.length / newPageSize),
        });
    };

    shouldComponentUpdate(props) {
        if (this.state.contentId !== props.contentId) {
            this.setState({
                contentId: props.contentId,
                elements: props.elements,
                pageSize: DEFAULT_PAGE_SIZE,
                totalPages: Math.ceil(props.elements.length / DEFAULT_PAGE_SIZE),
                currentPage: this.state.currentPage,
            });
        }

        return true;
    }

    render() {
        const pos = (this.state.currentPage - 1) * this.state.pageSize;
        const page = this.state.elements ? this.state.elements.slice(pos, pos + this.state.pageSize) : [];

        return (
            <div>
                <List>{page}</List>
                <Grid columns='three'>
                    <Grid.Row>
                        <Grid.Column width={4}></Grid.Column>
                        <Grid.Column width={8}>
                            <Pagination
                                activePage={this.state.currentPage}
                                totalPages={this.state.totalPages}
                                onPageChange={this.handlePaginationChange}
                            />
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <div>
                                <Select
                                    id='page-size-select'
                                    name='page-size-select'
                                    onChange={this.setPageSize}
                                    options={pageSizeOptions}
                                    defaultValue={this.state.pageSize}
                                />
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}