class Lesson < ActiveRecord::Base
  attr_accessible :description, :title

  #Lessons contain multiple exercises and tests - the user does a lesson which means working through several exercises
  has_many :exercises

  def next_exercise(exercise)
  	exercises.find_by_sortForLesson(exercise.sortForLesson + 1)
  end

  def sorted_exercises
  	exercises.sort_by { |exercise| exercise.sortForLesson }
  end
end
