import { Injectable } from '@nestjs/common';
import { Prisma, WeatherReport } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';

@Injectable()
export class WeatherReportRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async paginate({
    limit,
    page,
    where,
    select,
    orderBy,
  }: {
    limit: number;
    page?: number;
    orderBy?: Prisma.WeatherReportOrderByWithRelationInput[];
    where?: Prisma.WeatherReportWhereInput;
    select?: Prisma.WeatherReportSelect;
  }) {
    console.log('where', { where, orderBy });
    let condition: Prisma.WeatherReportWhereInput = { ...where };

    const [count, data] = await Promise.all([
      this.client.weatherReport.count({ where: condition }),
      await this.client.weatherReport.findMany({
        where: condition,
        orderBy: orderBy,
        select,
        take: limit,
        skip: (page ? page - 1 : 0) * limit,
      }),
    ]);

    return {
      count,
      page: page || 1,
      limit,
      hasMore: data.length > limit,
      items: data,
    };
  }
  async gets(
    where?: Prisma.WeatherReportWhereInput,
    select?: Prisma.WeatherReportSelect,
  ) {
    return this.client.weatherReport.findMany({
      where,
      select,
    });
  }

  async get(id: number) {
    return this.client.weatherReport.findUniqueOrThrow({
      where: { id },
    });
  }

  async create(model: Prisma.WeatherReportCreateInput) {
    return this.client.weatherReport.create({
      data: {
        ...model,
        createdAt: new Date(),
      },
    });
  }

  async update(id: number, model: WeatherReport) {
    return this.client.weatherReport.update({
      where: { id },
      data: {
        ...model,
      },
    });
  }

  async delete(id: number) {
    return this.client.weatherReport.delete({
      where: { id },
    });
  }
}
