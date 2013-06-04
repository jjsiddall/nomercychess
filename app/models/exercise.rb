class Exercise < ActiveRecord::Base
  attr_accessible :description, :lesson_id, :start, :title, :nextExercise, :sortForLesson, :conclusion

  has_many :moves, :dependent => :destroy
  has_many :completions
  
  belongs_to :lesson
end
