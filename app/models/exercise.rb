class Exercise < ActiveRecord::Base
  attr_accessible :description, :lesson_id, :start, :title, :nextExercise, :sortForLesson, :conclusion

  has_many :moves, :dependent => :destroy
  has_many :completions
  
  belongs_to :lesson

  def isDoneForUser(last_completed, user_id)
	completed = completions.where(:user_id => user_id, :last_completed => last_completed).first
	if completed.nil?
		return
	else
		return completed.updated_at
	end
  end  

end
