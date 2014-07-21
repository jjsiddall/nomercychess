class Lesson < ActiveRecord::Base
  attr_accessible :description, :title, :label

  #Lessons contain multiple exercises and tests - the user does a lesson which means working through several exercises
  has_many :exercises

  has_many :completions, :through => :exercises

  def next_exercise(exercise)
  	exercises.find_by_sort_for_lesson(exercise.sort_for_lesson + 1)
  end

  def sorted_exercises
  	exercises.sort_by { |exercise| exercise.sort_for_lesson }
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

  # this is duplication of what is in the "moves"
  def self.to_csv(all_items)
    CSV.generate do |csv|
      csv << column_names
      all_items.each do |item|
        csv << item.attributes.values_at(*column_names)
      end
    end
  end
  
  def self.import(file)
    CSV.foreach(file.path, headers: true) do |row|
      # Move.create! row.to_hash
      if find_by_id(row["id"])
        item = find_by_id(row["id"])
        item.attributes = row.to_hash.slice(*accessible_attributes)
        item.save!
      else
        item = Lesson.new
        item.attributes = row.to_hash.slice(*accessible_attributes)
        #this is code where I am going to try something)
        item.id = row.to_hash.slice("id")["id"].to_i
      
        item.save!
      end
    end
  end

end
