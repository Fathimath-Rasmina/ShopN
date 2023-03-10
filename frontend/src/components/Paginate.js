import React from 'react'
import {Nav, Pagination} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Paginate({pages, page ,keyword='', isAdmin=false}) {

    if(keyword){
        keyword =keyword.split('?keyword=')[1].split('&')[0]
    }

    console.log('KEYWORD:',keyword)

    return (pages > 1 && (
        <Pagination>
            {[...Array(pages).keys()].map((x) => (
                <Link
                    key={x + 1}
                    to={
                        `/?keyword=${keyword}&page=${x + 1}` 
                    }
                >
                    <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
                </Link>
            ))}
        </Pagination>
    )
    )
}

export default Paginate