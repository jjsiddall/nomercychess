class Exercise < ActiveRecord::Base
  attr_accessible :description, :lesson_id, :start, :title, :nextExercise, :sortForLesson

  has_many :moves, :dependent => :destroy
  belongs_to :lesson
end
