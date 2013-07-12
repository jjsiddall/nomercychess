class Lesson < ActiveRecord::Base
  attr_accessible :description, :title

  #Lessons contain multiple exercises and tests - the user does a lesson which means working through several exercises
  has_many :exercises

  has_many :completions, :through => :exercises

  def next_exercise(exercise)
  	exercises.find_by_sortForLesson(exercise.sortForLesson + 1)
  end

  def sorted_exercises
  	exercises.sort_by { |exercise| exercise.sortForLesson }
  end

  def find_percent_complete(completionType, user_id)
    count = 0
    exercises.each do |exercise|
      count = count + exercise.completions.where(:last_completed => completionType, :user_id => user_id).count
    end
    count = count.to_f / (exercises.count*3)*100
    return count
  end

  def find_percent_complete_all(user_id)
    return find_percent_complete("exercise", user_id) + find_percent_complete("practice", user_id) + find_percent_complete("quiz", user_id)
  end

end
