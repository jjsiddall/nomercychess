source 'https://rubygems.org'

ruby '2.2.1'

gem 'rails', '3.2.17'

group :assets do
  gem 'sass-rails',   '~> 3.2.3'
  gem 'coffee-rails', '~> 3.2.1'
  gem 'uglifier', '>= 1.0.3'
end

gem 'jquery-rails'
gem 'jquery-ui-rails'

group :development, :test do
  gem 'sqlite3'
  gem "rspec-rails", ">= 2.12.2"
  gem "factory_girl_rails", ">= 4.1.0"
end

group :production do
  
  gem 'pg'
  gem "thin", ">= 1.5.0"
end

gem "database_cleaner", ">= 0.9.1", :group => :test
gem "email_spec", ">= 1.4.0", :group => :test
gem "cucumber-rails", ">= 1.3.0", :group => :test, :require => false
gem "launchy", ">= 2.1.2", :group => :test
gem "capybara", ">= 2.0.2", :group => :test

gem "bootstrap-sass", ">= 2.2.2.0"
gem "font-awesome-sass"
gem "devise", ">= 2.2.2"
gem "cancan", ">= 1.6.8"
gem "rolify", ">= 3.2.0"
gem "simple_form", ">= 2.0.4"
gem "stripe", ">= 1.7.4"
gem "stripe_event", ">= 0.4.0"

gem "figaro", ">= 0.6.4"

gem "quiet_assets", ">= 1.0.1", :group => :development
gem "better_errors", ">= 0.3.2", :group => :development
gem "binding_of_caller", ">= 0.6.8", :group => :development
# gem "hub", ">= 1.10.2", :require => nil, :group => [:development]

#for seed file generation
gem "seed_dump"

#for heroku deployment
gem "rails_12factor"