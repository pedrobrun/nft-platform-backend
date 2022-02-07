# Mock NFT Platform. 
## Here are my considerations and conclusion on the backend application of the project.

<!--ts-->

### Improvements to be made
  * Tests
      - Since the application paper didn't mention automated Tests writing, I chose not to implement them at first, fearing I'd not be able to finish everything before the deadline. But I definitely need to implement Tests and I plan on using Jest.
      
<br/>

  * Decoupling/DI
      - I probably should have been more patient before I started coding, and implemented better architectured layers with a Repository from the beggining. This way I would've been able to use more Dependency Injection to decouple more everything.
      
<br/>

  * Responsabilities
      - There are controllers that I think might have ended up with too many responsabilies. I must refactor that and transfer logic responsabilites to Service layer.
      - :yellow_circle: ADD REPOSITORY LAYER: In progress. Check out feat/add-repository-layer branch.
<br/>

  * Clean code
      - There's always room for improvement, so overall writing cleaner code.
<br/>

  * Documentation
      - I want to write Swagger documentation for the Api.

### Technologies
  * Architecture:
      - I architectured the application using DDD pattern
      - I planned on having 3 main layers: Services, Controllers and Repositories. I ended up having only Controllers and Services plus obviously the Model layer. The reason for that is I made everything in a bit of a hurry, and since it's a small project, I figured out this wasn't the most important point, but ideally I'd refactor some stuff to organize responsabilities better (Some controllers might have ended up with too much of them), add Repositories layer and decouple more the layers, using Dependency Injection.
      
<br/>

  * Cloud:
      - AWS: I used a S3 bucket to store all the images.
      - MongoDB Atlas: I used Atlas to store the rest of the application's data, such as Users and NFTs themselves (which contain S3 stored file).
      - Heroku: Application is deployed in Heroku's cloud: https://nft-platform-api.herokuapp.com/
<br/>

  * Frameworks/Tools:
      - I choose not to user any server-side framework besides Express: Thought implementing an application in a more raw style would display my bit of knowledge and skills better (Might not even be the case lol, just my opinion).
