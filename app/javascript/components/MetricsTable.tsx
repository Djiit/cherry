import { Button, Rating, TextInput } from 'flowbite-react'
import _ from 'lodash'
import React, { useState } from 'react'
import { MdSearch } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { timeAgoInWords } from '../helpers/applicationHelper'
import useCurrentUser from '../hooks/useCurrentUser'
import { useFavoritesCreate, useFavoritesDestroy } from '../queries/user/favorites'
import SortedTable from './SortedTable'

const MetricsTable = ({ metrics }) => {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { mutate: addFavorite } = useFavoritesCreate()
  const { mutate: removeFavorite } = useFavoritesDestroy()
  const { user } = useCurrentUser()

  const filteredMetrics = _.sortBy(
    metrics.filter(
      (metric) =>
        metric.name.toLowerCase().includes(search.toLowerCase()) ||
        metric.project.name.toLowerCase().includes(search.toLowerCase())
    ),
    (metric) => (user.favorite_metric_ids.includes(metric.id) ? 0 : 1) + metric.name.toLowerCase()
  )

  const handleClick = (metric) => navigate(`/user/projects?project_id=${metric.project_id}&metric_id=${metric.id}`)

  const columns = React.useMemo(
    () => [
      {
        Header: 'Metric',
        accessor: 'name',
        Cell: ({ row }) => (
          <div className="flex items-center text-white">
            <Button
              size="xs"
              color="dark"
              className="mr-3"
              onClick={(event) => {
                event.stopPropagation()
                user.favorite_metric_ids.includes(row.original.id)
                  ? removeFavorite({ id: row.original.id, klass: 'Metric' })
                  : addFavorite({ id: row.original.id, klass: 'Metric' })
              }}
            >
              <Rating>
                <Rating.Star filled={user.favorite_metric_ids.includes(row.original.id)} />
              </Rating>
            </Button>
            {row.original.name}
          </div>
        ),
      },
      {
        Header: 'Last report',
        accessor: 'updated_at',
        Cell: ({ row }) => timeAgoInWords(row.original.updated_at),
      },
    ],
    [user.favorite_metric_ids]
  )

  const data = React.useMemo(() => filteredMetrics, [filteredMetrics])

  return (
    <>
      <TextInput
        type="text"
        id="table-search"
        className="mb-3 w-80"
        placeholder="Filter metrics"
        onChange={(event) => setSearch(event.target.value)}
        icon={MdSearch}
        autoComplete="off"
      />
      <SortedTable data={data} columns={columns} onRowClick={handleClick}></SortedTable>
    </>
  )
}

export default MetricsTable
