import React from 'react'
import { Breadcrumb, Card, Dropdown } from 'flowbite-react'
import { getParam, setParam, setParams } from '../helpers/applicationHelper'

const Filters = ({ projects, metrics }) => {
  const projectId = getParam('project_id')
  const currentProject = projects.find((project) => project.id === parseInt(projectId))

  const currentMetricId = getParam('metric_id')
  const currentMetric = metrics.find((metric) => metric.id === parseInt(currentMetricId))

  return (
    <Card className="mb-3">
      <Breadcrumb>
        <Breadcrumb.Item>
          <button onClick={() => Turbo.visit('/user/projects')} className="hover:text-white cursor-pointer">
            Projects
          </button>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <div className="hover:text-white">
            <Dropdown label={currentProject.name} inline>
              {projects.map((project) => (
                <Dropdown.Item key={project.id} onClick={() => setParams({ project_id: project.id })}>
                  {project.name}
                </Dropdown.Item>
              ))}
            </Dropdown>
          </div>
        </Breadcrumb.Item>
        {currentMetric && (
          <Breadcrumb.Item>
            <div className="hover:text-white">
              <Dropdown label={currentMetric.name} inline>
                {metrics.map((metric) => (
                  <Dropdown.Item key={metric.id} onClick={() => setParam('metric_id', metric.id)}>
                    {metric.name}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div>
          </Breadcrumb.Item>
        )}
      </Breadcrumb>
    </Card>
  )
}
export default Filters