import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PlanetsContext from './PlanetsContext';

const SW_API = 'https://swapi.dev/api/planets';

function PlanetsProvider({ children }) {
  const [data, setData] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [hasFilter, setHasFilter] = useState(false);
  const [comparison, setComparison] = useState('maior que');
  const [orderColumn, setOrderColumn] = useState('population');
  const initialColumns = ['population', 'orbital_period', 'diameter',
    'rotation_period', 'surface_water'];
  const [columns, setColumns] = useState(initialColumns);

  function SortArray(x, y) {
    return x.name.localeCompare(y.name);
  }

  useEffect(() => {
    const getPlanets = async () => {
      try {
        const response = await fetch(SW_API);
        const { results } = await response.json();
        const resultsFiltered = results.map((element) => {
          delete element.residents;
          return element;
        }).sort(SortArray);
        setInitialData(resultsFiltered);
        setData(resultsFiltered);
      } catch (errorRequest) {
        console.log(errorRequest);
      }
    };
    getPlanets();
  }, []);

  useEffect(() => {
    const newData = initialData
      .filter(({ name }) => name.toLowerCase().includes(filterText));
    setData(newData);
  }, [filterText, initialData, setData]);

  // const combineFilter = (column, comparison, number) => {
  //   console.log('xablau_provider', column, comparison, number);
  //   const combineFilterResult = data.filter((planet) => {
  //     if (comparison === 'maior que') {
  //       return Number(planet[column] > Number(number));
  //     } if (comparison === 'menor que') {
  //       return Number(planet[column] < Number(number));
  //     }
  //     return (Number(planet[column]) === Number(number));
  //   });
  //   const filterElement = { column, comparison, number };
  //   // console.log(filterElement);
  //   setFilteredData([...filteredData, filterElement]);
  //   setHasFilter(true);
  //   setData(combineFilterResult);
  //   const columnsFiltered = columns.filter((elements) => elements !== column);
  //   setColumns(columnsFiltered);
  // };

  useEffect(() => {
    let newFilteredData = initialData;
    filteredData.forEach((filterEl) => {
      newFilteredData = newFilteredData.filter((planet) => {
        if (filterEl.comparison === 'maior que') {
          return Number(planet[filterEl.column]) > Number(filterEl.number);
        } if (filterEl.comparison === 'menor que') {
          return Number(planet[filterEl.column]) < Number(filterEl.number);
        }
        return (Number(planet[filterEl.column]) === Number(filterEl.number));
      });
    });
    setData(newFilteredData);
  }, [filteredData, initialData]);

  const contextValue = {
    data,
    setData,
    filterText,
    setFilterText,
    hasFilter,
    filteredData,
    columns,
    setFilteredData,
    setColumns,
    initialData,
    setHasFilter,
    comparison,
    setComparison,
    orderColumn,
    setOrderColumn,
    initialColumns,
  };

  return (
    <PlanetsContext.Provider value={ contextValue }>
      {children}
    </PlanetsContext.Provider>
  );
}

PlanetsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PlanetsProvider;
