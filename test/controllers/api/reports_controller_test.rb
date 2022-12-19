# frozen_string_literal: true

require 'test_helper'

class Api::ReportsControllerTest < ActionDispatch::IntegrationTest
  let!(:user) { create(:user) }

  it 'creates reports' do
    post(api_reports_path(api_key: user.api_key), params: payload)
    assert_response :ok
    assert default_metrics[:js_loc][:total], Report.last.metrics['js_loc']['total']
  end

  it 'creates projects as public by default for non-premium users' do
    post(api_reports_path(api_key: user.api_key), params: payload)
    assert_equal 'public', Project.last.access
  end

  it 'creates projects as private by default for premium users' do
    create(:membership, user:)
    post(api_reports_path(api_key: user.api_key), params: payload)
    assert_equal 'private', Project.last.access
  end

  it 'requires a project name' do
    post(api_reports_path(api_key: user.api_key), params: payload.except(:project_name))
    assert_includes response.body, "Name can't be blank"
  end

  private

  def new_occurrence(repo = 'rails/rails')
    {
      metric_name: 'react_query_v1',
      file_path: 'app/controllers/occurrences_controller.rb',
      line_number: 10,
      line_content: 'class OccurrencesController < ApplicationController',
      owners: ['@fwuensche'],
      repo:,
    }
  end

  def payload(project_name: 'rails/rails')
    { project_name:, commit_sha: '71b1647', commit_date: '2022-10-16 16:00:00', metrics: default_metrics }
  end

  def default_metrics
    { js_loc: { owners: { ditto: 431, pasta: 42 }, total: 473 }, react_query_v3: { owners: {}, total: 23 } }
  end
end