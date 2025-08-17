import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { User } from '@prisma/client';

describe('SessionService', () => {
  let service: SessionService<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionService],
    }).compile();

    service = module.get<SessionService<User>>(SessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
