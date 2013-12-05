class Exercise < ActiveRecord::Base
  attr_accessible :description, :lesson_id, :start, :title, :next_exercise, :sort_for_lesson, :conclusion

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
        item = Exercise.new
        item.attributes = row.to_hash.slice(*accessible_attributes)
        #this is code where I am going to try something)
        item.id = row.to_hash.slice("id")["id"].to_i
      
        item.save!
      end
    end
  end
  
end
