import Link from 'next/link';
import type { NextPage } from 'next';
import styled from 'styled-components';
import products from '../api/data/products.json';
import ProductList from '../components/ProductList';
import { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import axios, { AxiosResponse } from 'axios';

const InfiniteScrollPage: NextPage = () => {
  const [productList, setProductList] = useState<AxiosResponse | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const getProducts = () => {
    axios
      .get(`/products?page=${pageNumber}&size=16`)
      .then((response) => {
        setProductList(response);
      })
      .catch((error) => console.log(error));
  };

  const { fetchNextPage } = useInfiniteQuery('productList', getProducts, {
    getNextPageParam: (lastPage) => {
      const { next } = lastPage;
      if (!next) return false;
      return Number(new URL(next).searchParams.get('page'));
    },
  });

  useEffect(() => {
    getProducts();
  }, [pageNumber]);

  const onIntersect = (entry: any) => entry.isIntersecting && fetchNextPage();

  return (
    <>
      <Header>
        <Link href='/'>
          <Title>HAUS</Title>
        </Link>
        <Link href='/login'>
          <p>login</p>
        </Link>
      </Header>
      <Container>
        <ProductList products={products} />
      </Container>
    </>
  );
};

export default InfiniteScrollPage;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

const Title = styled.a`
  font-size: 48px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px 40px;
`;
