class Exercise < ActiveRecord::Base
  attr_accessible :description, :lesson_id, :start, :title

  has_many :moves
  belongs_to :lesson
end
